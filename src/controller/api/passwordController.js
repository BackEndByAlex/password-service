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
    
    console.log('[SAVING PASSWORD] Creating password entry for user:', {
      userId,
      provider: req.user.provider,
      service
    });

    const entry = new PasswordEntry({
      userId,
      service,
      username,
      password
    });

    await entry.save();
    console.log('[PASSWORD SAVED] Successfully saved password entry');

    return res.status(201).json({ message: 'Lösenord sparat!' });
  } catch (err) {
    console.error('[SAVE PASSWORD ERROR]', {
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
/**
 * Retrieves all password entries for the authenticated user.
 *
 * @param {object} req - The request object, containing user information.
 * @param {object} res - The response object, used to send the result.
 */
export const getUserPasswords = async (req, res) => {
  try {
    console.log('[PASSWORD RETRIEVAL] Attempting to get passwords for user:', {
      uid: req.user.uid,
      email: req.user.email,
      provider: req.user.provider
    });
    
    // Check which ID is stored in the database with a test query
    if (req.user.uid) {
      const testWithUid = await PasswordEntry.findOne({ userId: req.user.uid });
      console.log('[DB TEST] Found with UID?', !!testWithUid);
      
      if (testWithUid) {
        // We found it with UID, continue with that
        const entries = await PasswordEntry.find({ userId: req.user.uid });
        const result = entries.map(entry => ({
          service: entry.service,
          username: entry.username,
          password: entry.password
        }));
        return res.status(200).json(result);
      }
    }
    
    // Try with email if UID didn't work
    if (req.user.email) {
      const testWithEmail = await PasswordEntry.findOne({ userId: req.user.email });
      console.log('[DB TEST] Found with email?', !!testWithEmail);
      
      if (testWithEmail) {
        const entries = await PasswordEntry.find({ userId: req.user.email });
        const result = entries.map(entry => ({
          service: entry.service,
          username: entry.username,
          password: entry.password
        }));
        return res.status(200).json(result);
      }
    }
    
    // If we got here, we tried both options and found nothing
    console.log('[DB RESULT] No passwords found for this user');
    return res.status(200).json([]); // Return empty array instead of error
    
  } catch (err) {
    console.error('[GET PASSWORDS ERROR]', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
    return res.status(500).json({ error: 'Kunde inte hämta lösenord.' });
  }
}
