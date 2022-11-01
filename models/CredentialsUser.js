import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const CredentialsUserSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  passwordSalt: {
    type: String,
    required: true,
  },
})

CredentialsUserSchema.plugin(uniqueValidator)

export default mongoose.models.CredentialsUser ||
  mongoose.model('CredentialsUser', CredentialsUserSchema)
