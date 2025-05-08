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
    console.log('[AFTER SAVE]', {
      raw: req.body.password,
      stored: entry.password
    })

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
/**
 * Retrieves all password entries for the authenticated user.
 *
 * @param {object} req - The request object, containing user information.
 * @param {object} res - The response object, used to send the result.
 */
export const getUserPasswords = async (req, res) => {
  try {
    console.log('req.user in getUserPasswords:', req.user)
    
    // Check what identifier is available and create a query that can match on either uid or email
    const query = {};
    if (req.user.uid) {
      // Add uid condition (this will match entries created with uid)
      query.$or = [{ userId: req.user.uid }];
      
      // If email is also available, add it as an alternative match condition
      if (req.user.email) {
        query.$or.push({ userId: req.user.email });
      }
    } else if (req.user.email) {
      // If only email is available
      query.userId = req.user.email;
    } else {
      // No valid identifier found
      throw new Error('No valid user identifier found');
    }
    
    console.log('Using query:', query);
    const entries = await PasswordEntry.find(query);

    // password-fältet
    const result = entries.map(entry => ({
      service: entry.service,
      username: entry.username,
      password: entry.password
    }));

    res.status(200).json(result);
  } catch (err) {
    logger.error('[GET PASSWORDS ERROR]', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
    res.status(500).json({ error: 'Kunde inte hämta lösenord.' });
  }
}
