import mongoose from 'mongoose'
import CryptoJS from 'crypto-js'

// Kontrollera att krypteringsnyckel finns
if (!process.env.ENCRYPTION_KEY) {
  console.error('❌ Missing encryption key — exiting.')
  process.exit(1)
}

// Hämta krypteringsnyckel från miljövariabel
const SECRET_KEY = process.env.ENCRYPTION_KEY

// Skapa lösenordsschema
const passwordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

// Middleware för att kryptera lösenordet innan det sparas
passwordSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    // Kryptera lösenordet
    this.password = CryptoJS.AES.encrypt(this.password, SECRET_KEY).toString()
  }
  next()
})

// Metod för att dekryptera lösenordet
passwordSchema.methods.getDecryptedPassword = function() {
  try {
    const bytes = CryptoJS.AES.decrypt(this.password, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('[DECRYPTION ERROR]', error)
    throw new Error('Failed to decrypt password')
  }
}

// Statisk metod för att returnera alla lösenord i dekrypterad form
passwordSchema.statics.getDecryptedPasswords = function(entries) {
  return entries.map(entry => ({
    service: entry.service,
    username: entry.username,
    password: entry.getDecryptedPassword()
  }))
}

export const PasswordEntry = mongoose.model('PasswordEntry', passwordSchema)