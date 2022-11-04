import crypto from 'crypto'
import connectToDb from 'backend/utils/connectToDb'
import User from 'models/User'

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

export async function findUsers(options) {
  await connectToDb()
  return await User.find(options)
}

export async function findUserById(id) {
  await connectToDb()
  return await User.findById(id)
}

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
