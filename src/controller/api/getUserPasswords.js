import { PasswordEntry } from '../../models/PasswordEntry.js'
import { logger } from '../../config/winston.js'

/**
 * Retrieves all password entries for the authenticated user.
 *
 * @param {object} req - The request object, containing user information.
 * @param {object} res - The response object, used to send the result.
 * @returns {object} - The response object with the user's password entries or an empty array.
 */
export const getUserPasswords = async (req, res) => {
  try {
    // Check which ID is stored in the database with a test query
    let entries = []

    if (req.user.uid) {
      entries = await PasswordEntry.find({ userId: req.user.uid })

      if (entries.length > 0) {
        // We found entries with UID, use them
        const result = PasswordEntry.getDecryptedPasswords(entries)
        return res.status(200).json(result)
      }
    }

    // Try with email if UID didn't work
    if (req.user.email) {
      entries = await PasswordEntry.find({ userId: req.user.email })

      if (entries.length > 0) {
        const result = PasswordEntry.getDecryptedPasswords(entries)
        return res.status(200).json(result)
      }
    }

    // If we got here, we tried both options and found nothing
    return res.status(200).json([]) // Return empty array instead of error
  } catch (err) {
    logger.error('[GET PASSWORDS ERROR]', {
      message: err.message,
      name: err.name,
      stack: err.stack
    })
    return res.status(500).json({ error: 'Kunde inte hämta lösenord.' })
  }
}
