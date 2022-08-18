import mongoose from 'mongoose'

const KittenSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
})

KittenSchema.methods.speak = function () {
  console.log(this.name)
}

export default mongoose.models.Kitten || mongoose.model('Kitten', KittenSchema)
