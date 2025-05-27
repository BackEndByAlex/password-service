import { PasswordEntry } from '../../models/PasswordEntry.js'

/**
 * Retrieves the password history for a specific password entry.
 *
 * @param {object} req - The request object, containing user information and the password ID.
 * @param {object} res - The response object, used to send the result.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {object} - The response object with the password history or an error.
 */
export async function passwordHistory (req, res, next) {
  const { id } = req.params
  const userId = req.user.uid

  try {
    const entry = await PasswordEntry.findOne({ _id: id, userId }).lean()

    if (!entry) {
      return res.status(404).json({ message: 'Lösenordsposten hittades inte' })
    }

    const history = Array.isArray(entry.history)
      ? entry.history
      : []

    // Returnera historik
    return res.json(history)
  } catch (err) {
    next(err)
  }
}
