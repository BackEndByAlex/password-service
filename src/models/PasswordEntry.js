import mongoose from 'mongoose'
import encrypt from 'mongoose-encryption'

/**
 * Skapar och returnerar PasswordEntry-modellen.
 * Säkerställer att env-variabler är laddade innan plugin används.
 * 
 * @returns {mongoose.Model} PasswordEntry
 */
function createPasswordModel() {
  const encKey = process.env.MONGO_ENCRYPTION_KEY
  const sigKey = process.env.MONGO_SIGNING_KEY

  if (!encKey || !sigKey) {
    throw new Error("Encryption keys are missing in environment variables.")
  }

  const passwordSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    service: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
  })

  passwordSchema.plugin(encrypt, {
    encryptionKey: Buffer.from(encKey, 'hex'),
    signingKey: Buffer.from(sigKey, 'hex'),
    encryptedFields: ['password']
  })

  return mongoose.model('PasswordEntry', passwordSchema)
}

export const PasswordEntry = createPasswordModel()