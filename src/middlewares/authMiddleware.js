
import jwt from 'jsonwebtoken'
import fs from 'fs'

// Läs public.pem
const publicKey = fs.readFileSync('./public.pem')

/**
 * Middleware to authenticate requests using a JWT token.
 * Enhanced to handle tokens from different providers more consistently.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Saknar Authorization header' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
    
    // Log the full decoded token to see its structure
    console.log('[TOKEN DEBUG] Decoded token:', JSON.stringify(decoded, null, 2))
    
    // Ensure we have a consistent user object structure regardless of provider
    req.user = {
      ...decoded,
      // Ensure uid is always available (might be in sub for some providers)
      uid: decoded.uid || decoded.sub || decoded.id || decoded.user_id
    };
    
    console.log('[AUTH SUCCESS] User authenticated:', {
      uid: req.user.uid,
      email: req.user.email,
      provider: req.user.provider
    });
    
    next()
  } catch (error) {
    console.error('[AUTH ERROR]', error.name, error.message)
    return res.status(401).json({ message: 'Ogiltig token' })
  }
}