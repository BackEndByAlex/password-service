import mongoose from 'mongoose'
import dotenv from 'dotenv'
import CryptoJS from 'crypto-js'

dotenv.config()


const SECRET_KEY = process.env.ENCRYPTION_KEY

// Skapa schema
const passwordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

// Pre-save middleware: kryptera lösenord
passwordSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      this.password = CryptoJS.AES.encrypt(this.password, SECRET_KEY).toString()
    } catch (err) {
      console.error('[ENCRYPTION ERROR]', err)
      return next(err)
    }
  }
  next()
})

// Instansmetod: dekryptera lösenord säkert
passwordSchema.methods.getDecryptedPassword = function () {
  try {
    if (!this.password || typeof this.password !== 'string') {
      throw new Error('Ogiltigt eller tomt lösenord')
    }

    const bytes = CryptoJS.AES.decrypt(this.password, SECRET_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)

    if (!decrypted) {
      throw new Error('Kunde inte dekryptera (troligen fel nyckel eller korrupt data)')
    }

    return decrypted
  } catch (error) {
    console.error('[DECRYPTION ERROR]', error.message)
    return '❌ Misslyckad dekryptering'
  }
}

// Statisk metod: dekryptera alla entries i lista
passwordSchema.statics.getDecryptedPasswords = function (entries) {
  return entries.map(entry => ({
    _id: entry._id,  
    service: entry.service,
    username: entry.username,
    password: entry.getDecryptedPassword()
  }))
}

// Exportera modellen
export const PasswordEntry = mongoose.models.PasswordEntry || mongoose.model('PasswordEntry', passwordSchema)
