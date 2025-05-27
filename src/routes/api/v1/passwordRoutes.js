import express from 'express'

import { savePassword } from '../../../controller/api/savePassword.js'
import { getUserPasswords } from '../../../controller/api/getUserPasswords.js'
import { getPasswordById } from '../../../controller/api/getPasswordById.js'
import { changePassword } from '../../../controller/api/changePassword.js'
import { deletePassword } from '../../../controller/api/deletePassword.js'
import { passwordHistory } from '../../../controller/api/passwordHistory.js'

import { authenticate } from '../../../middlewares/authMiddleware.js'

export const router = express.Router()

// Spara nytt lösenord
router.post('/passwords', authenticate, savePassword)

router.get('/passwords', authenticate, getUserPasswords)

router.get('/passwords/:id', authenticate, getPasswordById)

router.put('/passwords/:id', authenticate, changePassword)

router.delete('/passwords/:id', authenticate, deletePassword)

router.get('/passwords/:id/history', authenticate, passwordHistory)
