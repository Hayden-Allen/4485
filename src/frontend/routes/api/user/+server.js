import { error } from '@sveltejs/kit'
import {
  createUser,
  findUsers,
  findUserById,
} from 'backend/functions/apiFunctions'
import { validateSessionCookie } from 'backend/functions/authFunctions'
import {
  createSessionToken,
  setSessionCookie,
} from 'backend/functions/authFunctions'

export async function GET({ url, cookies }) {
  const session = validateSessionCookie(cookies)

  let users = []
  const searchByUsername = url.searchParams.has('username')

  if (url.searchParams.has('userId')) {
    users = [await findUserById(session, url.searchParams.get('userId'))]
  } else if (searchByUsername) {
    users = await findUsers(session, {
      username: url.searchParams.get('username'),
    })
  } else if (session) {
    users = [await findUserById(session, session.userId)]
  } else {
    throw new Error('Must provide userId or username')
  }

  let exactMatch = null

  for (let i = 0; i < users.length; ++i) {
    users[i] = {
      id: users[i]._id,
      username: users[i].username,
    }

    if (
      searchByUsername &&
      users[i].username === url.searchParams.get('username')
    ) {
      exactMatch = i
    }
  }

  if (exactMatch !== null) {
    const user = users.splice(exactMatch, 1)
    users = [user, ...users]
  }

  return new Response(JSON.stringify(users), {
    'Content-Type': 'application/json',
  })
}

export async function POST({ request, cookies }) {
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
  setSessionCookie(cookies, createSessionToken(user))

  return new Response(
    JSON.stringify({
      _id: user._id,
    }),
    {
      'Content-Type': 'application/json',
    }
  )
}
