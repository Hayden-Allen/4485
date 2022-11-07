import crypto from 'crypto'
import connectToDb from 'backend/utils/connectToDb'
import User from 'models/User'
import Game from 'models/Game'

export async function validateUserCredentials(options) {
  await connectToDb()

  const user = await User.findOne({
    username: options.username,
  })

  if (!user) {
    return null
  }

  const hash = crypto
    .pbkdf2Sync(options.password, user.passwordSalt, 1000, 64, 'sha512')
    .toString('hex')

  if (hash === user.passwordHash) {
    return user
  } else {
    return null
  }
}

export async function createUser(options) {
  await connectToDb()

  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(options.password, salt, 1000, 64, 'sha512')
    .toString('hex')

  const user = await User.create({
    createdAt: new Date(),
    username: options.username,
    passwordSalt: salt,
    passwordHash: hash,
  })

  return user
}

export async function findUsers(session, options, sortAndLimit) {
  await connectToDb()
  let query = User.find(options)
  if (sortAndLimit) {
    if (sortAndLimit.sort) {
      query = query.sort(sortAndLimit.sort)
    }
    if (sortAndLimit.limit) {
      query = query.limit(sortAndLimit.limit)
    }
  }
  return await query
}

export async function findUserById(session, id) {
  await connectToDb()
  return await User.findById(id)
}

export async function updateUser(session, options) {
  await connectToDb()
  await User.updateOne({ _id: session.userId }, options)
}

export async function deleteUser(session) {
  await connectToDb()
  await User.deleteOne({ _id: session.userId })
}

export async function createGame(session, options) {
  await connectToDb()

  const game = await Game.create({
    createdAt: new Date(),
    creatorId: session.userId,
    lastModifiedAt: new Date(),
    isPublic: options.isPublic === true,
    name: options.name,
    serializedContent: options.serializedContent,
  })

  return game
}

export async function findGames(session, options, sortAndLimit) {
  await connectToDb()
  let query = Game.find(options)
  if (sortAndLimit) {
    if (sortAndLimit.sort) {
      query = query.sort(sortAndLimit.sort)
    }
    if (sortAndLimit.limit) {
      query = query.limit(sortAndLimit.limit)
    }
  }
  let games = await query
  games = games.filter((game) => {
    return game.isPublic || (session && game.creatorId.equals(session.userId))
  })
  return games
}

export async function findGameById(session, id) {
  await connectToDb()
  const game = await Game.findById(id)
  if (game.isPublic || (session && game.creatorId.equals(session.userId))) {
    return game
  } else {
    return null
  }
}

export async function updateGame(session, gameId, options) {
  await connectToDb()

  const game = await Game.findById(gameId)
  if (!game) {
    throw new Error(`updateGame: no game found with id: ${gameId}`)
  }

  if (game.creatorId.equals(session.userId)) {
    if (typeof options.isPublic !== 'undefined') {
      game.isPublic = options.isPublic === true
    }
    if (options.name) {
      game.name = options.name
    }
    if (options.serializedContent) {
      game.serializedContent = options.serializedContent
    }
    game.lastModifiedAt = new Date()
    await game.save()
  } else {
    throw new Error(
      `updateGame: incorrect permissions to update game ${game._id}: session.userId=${session.userId} and game.creatorId=${game.creatorId}`
    )
  }
}

export async function deleteGame(session, gameId) {
  await connectToDb()
  await Game.deleteOne({ _id: gameId, creatorId: session.userId })
}
