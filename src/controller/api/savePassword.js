import { PasswordEntry } from '../../models/PasswordEntry.js'
import { logger } from '../../config/winston.js'

/**
 * Saves a password entry for the authenticated user.
 *
 * @param {object} req - The request object, containing user information and password details.
 * @param {object} res - The response object, used to send the result.
 * @returns {object} - The response object with a success message or an error.
 */
export const savePassword = async (req, res) => {
  try {
    const { service, username, password } = req.body

    // Always use uid if available, fallback to email
    const userId = req.user.uid || req.user.email

    const entry = new PasswordEntry({
      userId,
      service,
      username,
      password // Kommer att krypteras automatiskt via pre-save hook
    })

    await entry.save()

    return res.status(201).json({ message: 'Lösenord sparat!' })
  } catch (err) {
    logger.error('[SAVE PASSWORD ERROR]', {
      message: err.message,
      name: err.name,
      stack: err.stack
    })
    return res.status(500).json({ error: 'Kunde inte spara lösenord.' })
  }
}
