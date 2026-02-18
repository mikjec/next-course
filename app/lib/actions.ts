'use server'

import { z } from 'zod'
import { sql } from '../../lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcrypt'

const FormSchema = z.object({
	id: z.string(),
	customerId: z.string({
		invalid_type_error: 'Please select a customer',
	}),
	amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than 0' }),
	status: z.enum(['pending', 'paid'], {
		invalid_type_error: 'Please select an invoice status',
	}),
	date: z.string(),
})

const RegisterFormSchema = z.object({
	name: z.string().min(3, 'Name is too short'),
	email: z.string().email('Wrong email address'),
	password: z.string().min(6, 'Invalid Password'),
	confirmPassword: z.string().min(6, 'Invalid confirmation password'),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true }) //tworzy nowy schemat, bedacy kopia FormSchema, ale bez pol id i date

export type State = {
	errors?: {
		//jest ? bo pole moze nie istniec
		customerId?: string[]
		amount?: string[]
		status?: string[]
	}
	message: string | null
}

export async function createInvoice(_prevState: State, formData: FormData) {
	const validatedFields = CreateInvoice.safeParse({
		//to zwraca obiekt z success: true i wtedy polem data: ... lub obiekt z success: false i pole error:...
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create Invoice.',
		}
	}

	const { customerId, amount, status } = validatedFields.data
	const amountInCents = amount * 100
	const date = new Date().toISOString().split('T')[0]

	try {
		await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`

		revalidatePath('/dashboard/invoices') //po utworzeniu fakty odswiez strone z fakturami
	} catch (error) {
		return {
			message: 'Database Error: Failed to Create Invoice, try again later',
		}
	}
	redirect('/dashboard/invoices') //przekierowuje uzytkownika na strone z fakturami
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export async function updateInvoice(id: string, _prevState: State, formData: FormData) {
	const validatedFields = UpdateInvoice.safeParse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Update Invoice.',
		}
	}

	const { customerId, amount, status } = validatedFields.data
	const amountInCents = amount * 100

	try {
		await sql`UPDATE invoices
					SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
					WHERE id = ${id}
				`

		revalidatePath('/dashboard/invoices')
	} catch (error) {
		return {
			message: 'Database Error: Failed to Update Invoice.',
		}
	}
	return redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
	try {
		await sql`DELETE FROM invoices WHERE id = ${id}`
	} catch (error) {
		console.log(`Deleting invoice error occured: ${error}`)
		throw new Error('Error: Failed to Delete Invoice, please try again later')
	}
	revalidatePath('/dashboard/invoices')
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
	try {
		await signIn('credentials', formData)
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return 'Invalid credentials.'
				default:
					return 'Something went wrong.'
			}
		}
		throw error
	}
}

export type RegState = {
	errors?: {
		//jest ? bo pole moze nie istniec
		name?: string[]
		email?: string[]
		password?: string[]
		confirmPassword?: string[]
	}
	message: string | undefined
}

export async function registerUser(_prevState: string | undefined | RegState, formData: FormData) {
	const validatedFields = RegisterFormSchema.safeParse({
		name: formData.get('name'),
		email: formData.get('email'),
		password: formData.get('password'),
		confirmPassword: formData.get('password'),
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid form data',
		}
	}

	const { name, email, password, confirmPassword } = validatedFields.data

	const hashedPassword = await bcrypt.hash(password, 10)

	if (password != confirmPassword) {
		return {
			message: 'Invalid form data',
		}
	}

	if (!(await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword})`)) {
		throw new Error('User registration failed, try again later')
	} else {
		await signIn('credentials', formData)
	}
}
