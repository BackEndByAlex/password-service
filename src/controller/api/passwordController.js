import { PasswordEntry } from '../../models/PasswordEntry.js'
import crypto from 'crypto'

// Din krypteringsnyckel – I verklig drift bör detta läsas från miljövariabel!
const ENCRYPTION_KEY = crypto.randomBytes(32) // 256-bit key
const IV_LENGTH = 16

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const savePassword = async (req, res) => {
  try {
    console.log('[DEBUG] req.user i password-service:', req.user)
    const { service, username, password } = req.body

    if (!service || !username || !password) {
      return res.status(400).json({ message: 'Alla fält krävs.' })
    }

    const encryptedPassword = encrypt(password)

    const entry = new PasswordEntry({
      userId: req.user.uid, // Kommer från JWT
      service,
      username,
      password: encryptedPassword
    })

    await entry.save()

    res.status(201).json({ message: 'Lösenord sparat!' })
  } catch (error) {
    console.error('[SAVE PASSWORD ERROR]', error)
    res.status(500).json({ message: 'Serverfel vid sparande av lösenord' })
  }
}
