import { deleteSessionCookie } from 'backend/functions/authFunctions'

export async function POST({ cookies }) {
  deleteSessionCookie(cookies)
  return new Response('OK')
}
