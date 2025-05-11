import express from 'express'
import {
  savePassword, 
  getUserPasswords, 
  getPasswordById, 
  changePassword,
  passwordHistory
} from '../../../controller/api/passwordController.js'
import { authenticate } from '../../../middlewares/authMiddleware.js'

export const router = express.Router()

// Spara nytt lösenord
router.post('/passwords', authenticate, savePassword)

router.get('/passwords', authenticate, getUserPasswords)

router.get('/passwords/:id', authenticate, getPasswordById)

router.put('/passwords/:id', authenticate, changePassword)

// router.delete('/passwords/:id', authenticate, deletePassword)

router.get('/passwords/:id/history', authenticate, passwordHistory)