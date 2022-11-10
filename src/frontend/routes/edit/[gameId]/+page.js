import { redirect } from '@sveltejs/kit'

export function load({ params }) {
  if (params.gameId) {
    return {
      gameId: params.gameId,
    }
  } else {
    throw redirect(307, '/my-account')
  }
}
