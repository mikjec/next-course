'use client'

import { lusitana } from '@/app/ui/fonts'
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon, PhotoIcon, UserIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from './button'
import { useActionState, useState } from 'react'
import { registerUser } from '@/app/lib/actions'
import { useSearchParams } from 'next/navigation'
import { set } from 'zod/v4'

export default function RegisterForm() {
	const [state, formAction, isPending] = useActionState(registerUser, undefined)
	const [matchingPasswords, setMatchingPasswords] = useState(true)

	function handlePasswordsMatch() {
		const password = document.getElementById('password') as HTMLInputElement
		const confirmPassword = document.getElementById('confirm-password') as HTMLInputElement
		if (!password || !confirmPassword) return
		if (password.value !== confirmPassword.value) {
			setMatchingPasswords(false)
		} else {
			setMatchingPasswords(true)
		}
	}

	return (
		<form
			className='space-y-3'
			action={formAction}
			aria-describedby='credentials-error'>
			<div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
				<h1 className={`${lusitana.className} mb-3 text-2xl`}>Please sign up to continue.</h1>
				<div className='w-full'>
					<div>
						<label
							className='mb-3 mt-5 block text-xs font-medium text-gray-900'
							htmlFor='name'>
							Name
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='name'
								type='text'
								name='name'
								placeholder='Enter your name'
								required
							/>
							<UserIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
						</div>
					</div>
					<div>
						<label
							className='mb-3 mt-5 block text-xs font-medium text-gray-900'
							htmlFor='email'>
							Email
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='email'
								type='email'
								name='email'
								placeholder='Enter your email address'
								required
							/>
							<AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
						</div>
					</div>

					<div className='mt-4'>
						<label
							className='mb-3 mt-5 block text-xs font-medium text-gray-900'
							htmlFor='password'>
							Password
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='password'
								type='password'
								name='password'
								placeholder='Enter password'
								required
								minLength={6}
							/>
							<KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
						</div>
					</div>
					<div className='mt-4'>
						<label
							className='mb-3 mt-5 block text-xs font-medium text-gray-900'
							htmlFor='confirm-password'>
							Confirm Password
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='confirm-password'
								type='password'
								name='confirm-password'
								placeholder='Enter password'
								required
								minLength={6}
								onBlur={handlePasswordsMatch}
							/>
							<KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
						</div>
						{matchingPasswords === false && (
							<div className='text-red-500 m-4 ml-0'>
								<p>Passwords don`t match</p>
							</div>
						)}
					</div>
				</div>
				<Button
					className='mt-4 w-full'
					aria-disabled={isPending}>
					Sign up <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
				</Button>
				<div className='flex h-8 items-end space-x-1'>
					{state?.message ?? (
						<div
							id='credentials-error'
							aria-atomic='true'
							aria-live='polite'
							className='m-4 ms-0 text-[13px] text-red-500'>
							<p>{state?.message}</p>
						</div>
					)}
				</div>
			</div>
		</form>
	)
}
