import { error } from '@sveltejs/kit'
import { createUser, findUsers } from 'backend/functions/apiFunctions'

export async function POST({ request }) {
  const body = await request.json()

  const username = body.username.trim()
  const { password } = body

  if (username.length < 3) {
    throw error(400, 'Username must contain three or more characters')
  }

  if (password.length < 8) {
    throw error(400, 'Password must contain eight or more characters')
  }

  const matchingUsername = await findUsers(null, { username })
  if (matchingUsername.length > 0) {
    throw error(400, 'This username is already taken')
  }

  const user = await createUser({ username, password })

  return new Response(
    JSON.stringify({
      _id: user._id,
    }),
    {
      'Content-Type': 'application/json',
    }
  )
}
