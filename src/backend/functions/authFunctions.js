import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

export function createSessionToken(user) {
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

export function validateSessionToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error(error)
    return null
  }
}

export function setSessionCookie(cookies, token) {
  cookies.set('session', token, {
    path: '/',
    sameSite: 'strict',
  })
}

export function deleteSessionCookie(cookies) {
  cookies.delete('session', {
    path: '/',
    sameSite: 'strict',
  })
}

export function getSessionCookie(cookies) {
  return cookies.get('session', {
    path: '/',
    sameSite: 'strict',
  })
}

export function validateSessionCookie(cookies) {
  return validateSessionToken(getSessionCookie(cookies))
}
