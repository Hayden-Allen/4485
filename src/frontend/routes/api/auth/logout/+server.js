import { deleteSessionCookie } from 'backend/functions/authFunctions'

export async function POST({ cookies }) {
  deleteSessionCookie(cookies)
  return new Response(JSON.stringify({ ok: true }), {
    'Content-Type': 'application/json',
  })
}
