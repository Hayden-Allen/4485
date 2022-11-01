import crypto from 'crypto'
import dbConnect from 'lib/dbConnect.js'
import CredentialsUser from 'models/CredentialsUser.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed')
    return
  }

  await dbConnect()

  const username = req.body.username.replace(/\s/g, '')
  const password = req.body.password

  if (username.length < 3) {
    throw new Error('Username must contain at least 3 characters')
  }

  if (username.length > 64) {
    throw new Error('Username must be shorter than 64 characters')
  }

  if (password.length < 8) {
    throw new Error('Password must contain at least 8 characters')
  }

  if (password.length > 64) {
    throw new Error('Password must be shorter than 64 characters')
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')

  await CredentialsUser.create({
    createdAt: new Date(),
    username,
    passwordSalt: salt,
    passwordHash: hash,
  })

  res.status(200).send('OK')
}
