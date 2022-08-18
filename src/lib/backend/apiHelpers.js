import connectToDb from './connectToDb'
import Kitten from './models/Kitten'

export async function createKitten(options) {
  await connectToDb()

  const kitten = new Kitten({
    name: options.name,
  })
  await kitten.save()

  return kitten
}
