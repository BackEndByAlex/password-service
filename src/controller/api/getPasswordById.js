import { PasswordEntry } from '../../models/PasswordEntry.js'
import { logger } from '../../config/winston.js'

/**
 * Retrieves a password entry by its ID for the authenticated user.
 *
 * @param {object} req - The request object, containing user information and the password ID.
 * @param {object} res - The response object, used to send the result.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {object} - The response object with the password entry or an error.
 */
export async function getPasswordById (req, res, next) {
  try {
    // Hämta utan .lean() för att få tillgång till instansmetoder
    const entry = await PasswordEntry.findById(req.params.id)

    if (!entry) {
      return res.status(404).json({ message: 'Lösenordet hittades inte' })
    }

    // Använd instansmetoden för att dekryptera
    const decryptedPassword = entry.getDecryptedPassword()

    return res.status(200).json({
      _id: entry._id,
      service: entry.service,
      username: entry.username,
      password: decryptedPassword
    })
  } catch (err) {
    logger.error('[GET PASSWORD BY ID ERROR]', err)
    return next(err)
  }
}
