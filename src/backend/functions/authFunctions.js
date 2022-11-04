import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

export async function createSessionToken(user) {
  return jwt.sign(
    {
      userId: user._id,
    },
    JWT_SECRET,
    {
      expiresIn: '24h',
    }
  )
}

export async function validateSessionToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function setSessionCookie(cookies, token) {
  cookies.set('session', token, {
    path: '/',
    sameSite: 'strict',
  })
}

export async function deleteSessionCookie(cookies) {
  cookies.set('session', '', {
    path: '/',
    sameSite: 'strict',
  })
}

export async function getSessionCookie(cookies) {
  return cookies.get('session', {
    path: '/',
    sameSite: 'strict',
  })
}

export async function validateSessionCookie(cookies) {
  return validateSessionToken(getSessionCookie(cookies))
}
