import mongoose from 'mongoose'

const passwordEntrySchema = new mongoose.Schema({
  userId: {
    type: String, // användarens uid från JWT
    required: true
  },
  service: {
    type: String,
    required: true
  },
  username: {
    type: String, // Ex: användarnamn för tjänsten
    required: true
  },
  password: {
    type: String, // Den krypterade lösenordsträngen
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const PasswordEntry = mongoose.model('PasswordEntry', passwordEntrySchema)
