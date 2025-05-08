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
    const entries = await PasswordEntry.find({ userId: req.user.uid })

    // password-fältet
    const result = entries.map(entry => ({
      service: entry.service,
      username: entry.username,
      password: entry.password
    }))

    res.status(200).json(result)
  } catch (err) {
    logger.error('[GET PASSWORDS ERROR]', err)
    res.status(500).json({ error: 'Kunde inte hämta lösenord.' })
  }
}
