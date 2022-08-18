import connectToDb from '../../lib/backend/connectToDb'
import { createKitten } from '../../lib/backend/apiHelpers'

export async function POST({ request, setHeaders, url }) {
  await connectToDb()
  const body = await request.json()
  const kitten = await createKitten(body)
  return {
    status: 200,
    body: JSON.stringify({
      name: kitten.name,
    }),
  }
}
