import { logger } from '../../config/winston.js'
import { PasswordEntry } from '../../models/PasswordEntry.js'


/**
 * Saves a password entry for the authenticated user.
 *
 * @param {object} req - The request object, containing user information and password details.
 * @param {object} res - The response object, used to send the result.
 */
export const savePassword = async (req, res) => {
  try {
    const { service, username, password } = req.body

    const entry = new PasswordEntry({
      userId: req.user.uid,
      service, // tjänst
      username, // användarnamn
      password // krypteras automatiskt!
    })

    await entry.save()
    res.status(201).json({ message: 'Lösenord sparat!' })
  } catch (err) {
    logger.error('[SAVE PASSWORD ERROR]', err)
    res.status(500).json({ error: 'Kunde inte spara lösenord.' })
  }
}

/**
 * Retrieves all password entries for the authenticated user.
 *
 * @param {object} req - The request object, containing user information.
 * @param {object} res - The response object, used to send the result.
 */
export const getUserPasswords = async (req, res) => {
  try {
    console.log('req.user in getUserPasswords:', req.user)

    const userId = req.user?.uid || req.user?.email

    if (!userId) {
      return res.status(401).json({ error: 'Ingen användaridentitet tillgänglig.' })
    }

    const entries = await PasswordEntry.find({ userId })

    const result = []

    for (const entry of entries) {
      try {
        // Testa dekryptering av lösenordet
        result.push({
          service: entry.service,
          username: entry.username,
          password: entry.password
        })
      } catch (decryptionError) {
        console.error('[DECRYPT ERROR]', {
          id: entry._id,
          service: entry.service,
          message: decryptionError.message
        })
        result.push({
          service: entry.service,
          username: entry.username,
          password: '❌ Kunde inte dekryptera'
        })
      }
    }

    res.status(200).json(result)
  } catch (err) {
    logger.error('[GET PASSWORDS ERROR]', {
      message: err.message,
      name: err.name,
      stack: err.stack
    })
    res.status(500).json({ error: 'Kunde inte hämta lösenord.' })
  }
}

