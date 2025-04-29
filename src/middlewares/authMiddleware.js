import jwt from 'jsonwebtoken'
import fs from 'fs'

// Läs public.pem
const publicKey = fs.readFileSync('./public.pem')

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Saknar Authorization header' })
  }

  const token = authHeader.split(' ')[1]
  console.log('[DEBUG] Token:', token)
  console.log('[DEBUG] Public key:', publicKey.toString())
  console.log('[DEBUG] Public key type:', typeof publicKey)

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
    req.user = decoded // Sparar decoded payload i requesten
    next()
  } catch (error) {
    console.error('[AUTH ERROR]', error)
    return res.status(401).json({ message: 'Ogiltig token' })
  }
}
