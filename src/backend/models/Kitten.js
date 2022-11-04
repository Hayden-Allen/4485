import mongoose from 'mongoose'

const KittenSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
})

export default mongoose.models.Kitten || mongoose.model('Kitten', KittenSchema)
