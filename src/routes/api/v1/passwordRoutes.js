import express from 'express'
import { savePassword, getUserPasswords } from '../../../controller/api/passwordController.js'
import { authenticate } from '../../../middlewares/authMiddleware.js'

export const router = express.Router()

// Spara nytt lösenord
router.post('/passwords', authenticate, savePassword)

router.get('/passwords', authenticate, getUserPasswords)
