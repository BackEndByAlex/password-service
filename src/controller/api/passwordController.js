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
    const { service, username, password } = req.body;
    
    // Always use uid if available, fallback to email
    const userId = req.user.uid || req.user.email;

    const entry = new PasswordEntry({
      userId,
      service,
      username,
      password // Kommer att krypteras automatiskt via pre-save hook
    });

    await entry.save();

    return res.status(201).json({ message: 'Lösenord sparat!' });
  } catch (err) {
    logger.error('[SAVE PASSWORD ERROR]', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
    return res.status(500).json({ error: 'Kunde inte spara lösenord.' });
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
    // Check which ID is stored in the database with a test query
    let entries = [];
    
    if (req.user.uid) {
      entries = await PasswordEntry.find({ userId: req.user.uid });
      
      if (entries.length > 0) {
        // We found entries with UID, use them
        const result = PasswordEntry.getDecryptedPasswords(entries);
        return res.status(200).json(result);
      }
    }
    
    // Try with email if UID didn't work
    if (req.user.email) {
      entries = await PasswordEntry.find({ userId: req.user.email });
      
      if (entries.length > 0) {
        const result = PasswordEntry.getDecryptedPasswords(entries);
        return res.status(200).json(result);
      }
    }
    
    // If we got here, we tried both options and found nothing
    return res.status(200).json([]); // Return empty array instead of error
    
  } catch (err) {
    logger.error('[GET PASSWORDS ERROR]', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
    return res.status(500).json({ error: 'Kunde inte hämta lösenord.' });
  }
}

export async function getPasswordById(req, res, next) {
  try {
    const entry = await PasswordEntry.findById(req.params.id).lean()
    if (!entry) {
      return res.status(404).json({ message: 'Lösenordet hittades inte' })
    }
    return res.json(entry)
  } catch (err) {
    return next(err)
  }
}