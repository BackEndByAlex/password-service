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
    
    logger.log('[SAVING PASSWORD] Creating password entry for user:', {
      userId,
      provider: req.user.provider,
      service
    });

    const entry = new PasswordEntry({
      userId,
      service,
      username,
      password // Kommer att krypteras automatiskt via pre-save hook
    });

    await entry.save();
    logger.log('[PASSWORD SAVED] Successfully saved password entry');

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
    logger.log('[PASSWORD RETRIEVAL] Attempting to get passwords for user:', {
      uid: req.user.uid,
      email: req.user.email,
      provider: req.user.provider
    });
    
    // Check which ID is stored in the database with a test query
    let entries = [];
    
    if (req.user.uid) {
      entries = await PasswordEntry.find({ userId: req.user.uid });
      logger.log('[DB TEST] Found with UID?', entries.length > 0);
      
      if (entries.length > 0) {
        // We found entries with UID, use them
        const result = PasswordEntry.getDecryptedPasswords(entries);
        return res.status(200).json(result);
      }
    }
    
    // Try with email if UID didn't work
    if (req.user.email) {
      entries = await PasswordEntry.find({ userId: req.user.email });
      logger.log('[DB TEST] Found with email?', entries.length > 0);
      
      if (entries.length > 0) {
        const result = PasswordEntry.getDecryptedPasswords(entries);
        return res.status(200).json(result);
      }
    }
    
    // If we got here, we tried both options and found nothing
    logger.log('[DB RESULT] No passwords found for this user');
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