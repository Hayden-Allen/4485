import { error } from '@sveltejs/kit'
import { validateUserCredentials } from 'backend/functions/apiFunctions'
import {
  createSessionToken,
  setSessionCookie,
} from 'backend/functions/authFunctions'

export async function POST({ request, cookies }) {
  const body = await request.json()

  const username = body.username.trim()
  const { password } = body

  const user = await validateUserCredentials({ username, password })
  if (!user) {
    throw error(400, 'Incorrect username or password')
  }

  setSessionCookie(cookies, createSessionToken(user))

  return new Response('OK')
}
