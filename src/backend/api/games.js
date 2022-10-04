import connectToDb from '../utils/connectToDb'
import Game from 'models/Game'

export async function createGame(options) {
  await connectToDb()

  const game = new Game({
    id: options.id,
    name: options.name,
    description: options.description,
  })
  await game.save()

  return game
}

export async function getGames() {
  await connectToDb()

  // Retrieving all games from db
  var game = await Game.find({})

  return game
}
