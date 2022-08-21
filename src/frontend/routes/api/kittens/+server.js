import connectToDb from 'backend/utils/connectToDb'
import { createKitten } from 'backend/api/kittens'

export async function POST({ request }) {
  await connectToDb()
  const body = await request.json()
  const kitten = await createKitten(body)
  console.log(kitten)
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
