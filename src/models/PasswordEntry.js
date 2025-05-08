import mongoose from 'mongoose'
import encrypt from 'mongoose-encryption'

// create a password schema
const passwordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

// Secret keys från .env
const encKey = process.env.MONGO_ENCRYPTION_KEY
const sigKey = process.env.MONGO_SIGNING_KEY

passwordSchema.plugin(encrypt, {
  encryptionKey: Buffer.from(encKey, 'hex'),
  signingKey: Buffer.from(sigKey, 'hex'),
  encryptedFields: ['password']
})

export const PasswordEntry = mongoose.models.PasswordEntry || mongoose.model('PasswordEntry', schema)

