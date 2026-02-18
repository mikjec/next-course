import { trpc } from '@/app/api/trpc/client'
import CustomersTable from '@/app/ui/customers/table'
import Image from 'next/image'

async function Page() {
	const customers = await trpc.customer.getAll.query()
	const customer1 = await trpc.customer.getById.query(customers[3].id)

	return (
		<div>
			{customers.map(customer => (
				<div
					key={customer.id}
					className='m-6'>
					<h2>{customer.name}</h2>
					<Image
						src={customer.image_url}
						alt='person'
						width={100}
						height={100}
					/>
				</div>
			))}

			<div className='bg-red-200'>
				<div
					key={customer1.id}
					className='m-6'>
					<h2>{customer1.name}</h2>
					<Image
						src={customer1.image_url}
						alt='person'
						width={100}
						height={100}
					/>
				</div>
			</div>
		</div>
	)
}

export default Page
