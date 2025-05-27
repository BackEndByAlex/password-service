import { PasswordEntry } from '../../models/PasswordEntry.js'

/**
 * Deletes a password entry for the authenticated user.
 *
 * @param {object} req - The request object, containing user information and the password ID.
 * @param {object} res - The response object, used to send the result.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {object} - The response object with a success message or an error.
 */
export async function deletePassword (req, res, next) {
  const { id } = req.params
  const userId = req.user.uid || req.user.email

  try {
    const result = await PasswordEntry.deleteOne({ _id: id, userId })
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Lösenordsposten hittades inte' })
    }
    return res.status(200).json({ message: 'Lösenordet har tagits bort' })
  } catch (err) {
    next(err)
  }
}
