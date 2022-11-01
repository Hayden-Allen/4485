import crypto from 'crypto'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import CredentialsUser from 'models/CredentialsUser.js'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const username = credentials.username.trim()
        const { password } = credentials

        const user = await CredentialsUser.findOne({
          username,
        })

        if (!user) {
          return null
        }

        const hash = crypto
          .pbkdf2Sync(password, user.passwordSalt, 1000, 64, 'sha512')
          .toString('hex')

        if (hash === user.passwordHash) {
          return {
            _id: user._id,
            username: user.username,
          }
        } else {
          return null
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
