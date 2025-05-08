import mongoose from 'mongoose'
import dotenv from 'dotenv'
import encrypt from 'mongoose-encryption'
dotenv.config()

// create a password schema
const passwordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

if (!process.env.MONGO_ENCRYPTION_KEY || !process.env.MONGO_SIGNING_KEY) {
  console.error('❌ Missing encryption keys — exiting.')
  process.exit(1)
}

// Secret keys från .env
const encKey = process.env.MONGO_ENCRYPTION_KEY
const sigKey = process.env.MONGO_SIGNING_KEY

passwordSchema.plugin(encrypt, {
  encryptionKey: Buffer.from(encKey, 'hex'),
  signingKey: Buffer.from(sigKey, 'hex'),
  encryptedFields: ['password']
})

export const PasswordEntry = mongoose.model('PasswordEntry', passwordSchema)
