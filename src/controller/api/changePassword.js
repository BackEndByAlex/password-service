import { PasswordEntry } from '../../models/PasswordEntry.js'
import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.ENCRYPTION_KEY

/**
 * Changes the password for a specific password entry.
 *
 * @param {object} req - The request object, containing user information and the new password details.
 * @param {object} res - The response object, used to send the result.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {object} - The response object with the updated password entry or an error.
 */
export async function changePassword (req, res, next) {
  const { id } = req.params
  const { password } = req.body
  const userId = req.user.uid

  try {
    // Kryptera nya lösenordet
    const encrypted = CryptoJS.AES.encrypt(password, SECRET_KEY).toString()

    // Uppdatera i databasen, pusha till historik om du vill
    const updated = await PasswordEntry.findOneAndUpdate(
      { _id: id, userId },
      {
        password: encrypted,
        $push: { history: { password: encrypted, changedAt: new Date() } }
      },
      { new: true }
    ).lean()

    if (!updated) {
      return res.status(404).json({ message: 'Lösenordsposten hittades inte' })
    }

    // Returnera dekrypterat lösenord eller hela objektet
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)

    return res.json({
      ...updated,
      password: decrypted
    })
  } catch (err) {
    next(err)
  }
}
