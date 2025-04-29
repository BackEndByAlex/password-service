import express from 'express'
import { router as authRoutes } from './api/v1/passwordRoutes.js'

export const router = express.Router()

router.use('/api/v1', authRoutes)
