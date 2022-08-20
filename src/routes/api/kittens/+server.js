import connectToDb from '../../../lib/backend/connectToDb'
import { createKitten } from '../../../lib/backend/apiHelpers'

export async function POST({ request, setHeaders, url }) {
  await connectToDb()
  const body = await request.json()
  const kitten = await createKitten(body)
  return new Response(
    JSON.stringify({
      name: kitten.name,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
