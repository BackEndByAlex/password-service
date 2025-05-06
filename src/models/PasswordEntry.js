import mongoose from 'mongoose'
import encrypt from 'mongoose-encryption'
import dotenv from 'dotenv'

dotenv.config()

const passwordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

// Secret keys från .env
const encKey = process.env.MONGO_ENCRYPTION_KEY
const sigKey = process.env.MONGO_SIGNING_KEY

if (!encKey || !sigKey) {
  throw new Error("❗ Missing encryption keys in environment variables.")
}

passwordSchema.plugin(encrypt, {
  encryptionKey: Buffer.from(encKey, 'hex'),
  signingKey: Buffer.from(sigKey, 'hex'),
  encryptedFields: ['password']
})

export const PasswordEntry = mongoose.model('PasswordEntry', passwordSchema)
