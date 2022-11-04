import { error } from '@sveltejs/kit'
import {
  createGame,
  updateGame,
  findGames,
  findGameById,
} from 'backend/api/apiFunctions'
import { validateSessionCookie } from 'backend/helpers/authFunctions'

export async function GET({ request, cookies }) {
  const body = await request.json()

  const session = validateSessionCookie(cookies)

  let games = null

  if (body.gameId) {
    games = [await findGameById(session, body.gameId)]
  } else if (body.creatorId) {
    games = await findGames(session, { creatorId: body.creatorId })
  } else {
    games = await findGames(
      session,
      {},
      {
        sort: {
          lastModifiedAt: -1,
        },
        limit: 10,
      }
    )
  }

  return new Response(JSON.stringify(games), {
    'Content-Type': 'application/json',
  })
}

export async function POST({ request, cookies }) {
  const body = await request.json()

  const session = validateSessionCookie(cookies)
  if (!session) {
    throw error(400, 'You must log in to upload a game')
  }

  if (body.gameId) {
    await updateGame(session, body.gameId, {
      isPublic: body.isPublic,
      name: body.name,
      serializedContent: body.serializedContent,
    })
  } else {
    await createGame(session, {
      isPublic: body.isPublic || false,
      name: body.name,
      serializedContent: body.serializedContent,
    })
  }

  return new Response('OK')
}
