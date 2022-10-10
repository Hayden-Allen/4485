import connectToDb from 'backend/utils/connectToDb'
import { createGame, getGames } from 'backend/api/games'
import Game from '../../../../backend/models/Game'

export async function POST({ request }) {
  await connectToDb()
  const body = await request.json()
  const game = await createGame(body)

  // Retrieving all games from db
  // var gameList = await Game.find({})
  // console.log(gameList)

  // Deleting games from db
  // var deleteGames = await Game.deleteMany({})
  // console.log(deleteGames)

  return new Response(
    JSON.stringify({
      id: game.id,
      name: game.name,
      description: game.description,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export async function GET() {
  await connectToDb()
  // Retrieving games from db
  const games = await getGames()

  // Returing json response of games
  return new Response(JSON.stringify(games), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
