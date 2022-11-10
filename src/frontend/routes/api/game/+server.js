import { error } from '@sveltejs/kit'
import {
  createGame,
  updateGame,
  findGames,
  findGameById,
} from 'backend/functions/apiFunctions'
import { validateSessionCookie } from 'backend/functions/authFunctions'

export async function GET({ url, cookies }) {
  const session = validateSessionCookie(cookies)

  let games = null

  if (url.searchParams.has('gameId')) {
    games = [await findGameById(session, url.searchParams.get('gameId'))]
  } else if (url.searchParams.has('creatorId')) {
    games = await findGames(session, {
      creatorId: url.searchParams.get('creatorId'),
    })
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

  for (let i = 0; i < games.length; ++i) {
    games[i] = games[i].toJSON()
    games[i].canEdit = games[i].creatorId.equals(session.userId)
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

  let game = null

  if (body.gameId) {
    game = await updateGame(session, body.gameId, {
      isPublic: body.isPublic,
      name: body.name,
      serializedContent: body.serializedContent,
    })
  } else {
    game = await createGame(session, {
      isPublic: body.isPublic || false,
      name: body.name,
      serializedContent: body.serializedContent,
    })
  }

  return new Response(
    JSON.stringify({
      _id: game._id,
    }),
    {
      'Content-Type': 'application/json',
    }
  )
}
