import produce from 'immer'
import { proxy } from 'valtio'

class Entity {
  constructor() {
    this.uuid = Math.floor(Math.random() * 10000000)
    this.name = `Untitled`
    this.randomizePosition()
  }

  randomizePosition() {
    this.x = Math.floor(Math.random() * 100)
    this.y = Math.floor(Math.random() * 100)
  }
}

export class Game {
  constructor() {
    this.entities = []
    this.selectedEntities = []
  }

  addEntity() {
    const entity = new Entity()
    this.entities = produce(this.entities, (draftEntities) => {
      draftEntities.push(entity)
    })
    return entity
  }

  removeEntity(entity) {
    this.entities = produce(this.entities, (draftEntities) => {
      const i = draftEntities.indexOf(entity)
      if (i !== -1) {
        draftEntities.splice(i, 1)
      }
    })
  }

  selectEntity(entity) {
    this.selectedEntities = produce(
      this.selectedEntities,
      (draftSelectedEntities) => {
        if (draftSelectedEntities.indexOf(entity) === -1) {
          draftSelectedEntities.push(entity)
        }
      }
    )
  }

  deselectEntity(entity) {
    this.selectedEntities = produce(
      this.selectedEntities,
      (draftSelectedEntities) => {
        const i = draftSelectedEntities.indexOf(entity)
        if (i !== -1) {
          draftSelectedEntities.splice(i, 1)
        }
      }
    )
  }
}

const gameProxy = proxy(new Game())
export default gameProxy
