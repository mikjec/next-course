import { sql } from '@/lib/db'
import { publicProcedure, router } from '../trpc'
import z from 'zod'

type Customer = {
	id: string
	name: string
	email: string
	image_url: string
}

export const customerRouter = router({
	getAll: publicProcedure.query(async () => {
		const customers: Customer[] = await sql`SELECT * FROM customers`
		return customers
	}),
	getById: publicProcedure.input(z.string()).query(async opts => {
		const { input } = opts
		const customer: Customer[] = await sql`Select * from customers WHERE id=${input}`
		return customer[0] || null
	}),
})
