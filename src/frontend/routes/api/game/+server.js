import { error } from '@sveltejs/kit'
import {
  createGame,
  updateGame,
  findGames,
  findGameById,
  deleteGame,
  findUserById,
} from 'backend/functions/apiFunctions'
import { validateSessionCookie } from 'backend/functions/authFunctions'

export async function GET({ url, cookies }) {
  const session = validateSessionCookie(cookies)

  let games = null

  if (url.searchParams.has('gameId')) {
    games = [await findGameById(session, url.searchParams.get('gameId'))]
  } else if (url.searchParams.has('creatorId')) {
    games = await findGames(
      session,
      {
        creatorId: url.searchParams.get('creatorId'),
      },
      {
        sort: {
          name: 1,
        },
      }
    )
  } else {
    games = await findGames(
      session,
      {},
      {
        sort: {
          lastModifiedAt: -1,
        },
        limit: 25,
      }
    )
  }

  const isMetaOnly = url.searchParams.get('isMetaOnly') === 'true'
  const isPublicOnly = url.searchParams.get('isPublicOnly') === 'true'
  for (let i = 0; i < games.length; ++i) {
    if (isPublicOnly) {
      if (!games[i].isPublic) {
        games.splice(i, 1)
        --i
        continue
      }
    }

    games[i] = games[i].toJSON()
    games[i].canEdit = session
      ? games[i].creatorId.equals(session.userId)
      : false

    if (isMetaOnly) {
      games[i] = {
        _id: games[i]._id,
        name: games[i].name,
        isPublic: games[i].isPublic,
        creatorName: (await findUserById(session, games[i].creatorId)).username,
      }
    }
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

export async function DELETE({ request, cookies }) {
  const body = await request.json()

  const session = validateSessionCookie(cookies)
  if (!session) {
    throw error(400, 'You must log in to delete a game')
  }

  if (body.gameId) {
    await deleteGame(session, body.gameId)
  } else {
    throw new Error('Missing gameId')
  }

  return new Response(
    JSON.stringify({
      ok: true,
    }),
    {
      'Content-Type': 'application/json',
    }
  )
}
