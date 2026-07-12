import { Router } from 'express'
import { validateApiKey } from '@middlewares/validate-api-key'
import { validateCountQuery } from '@middlewares/validate-count-query'
import { asyncHandler } from '@utils/async-handler'
import { simulationController } from '../container'

const router = Router()

router.use(validateApiKey)

router.post('/naive', validateCountQuery, asyncHandler(simulationController.naive))
router.post('/optimized', validateCountQuery, asyncHandler(simulationController.optimized))
router.post('/compare', validateCountQuery, asyncHandler(simulationController.compare))
router.post('/compare/stream', validateCountQuery, simulationController.compareStream)

export { router as simulationRouter }
