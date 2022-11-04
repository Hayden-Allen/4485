import mongoose from 'mongoose'

const GameSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  lastModifiedAt: {
    type: Date,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  serializedContent: {
    type: String,
    required: true,
  },
})

export default mongoose.models.Game || mongoose.model('Game', GameSchema)
