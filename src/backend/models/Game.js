import mongoose from 'mongoose'

const GameSchema = new mongoose.Schema({
  id: {
    required: true,
    type: Number,
  },
  name: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
})

export default mongoose.models.Game || mongoose.model('Game', GameSchema)
