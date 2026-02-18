import { customerRouter } from './customers'
import { router } from '../trpc'

export const appRouter = router({
	customer: customerRouter,
})

export type AppRouter = typeof appRouter
