import { useSnapshot } from 'valtio'
import gameProxy from '../proxies/proxies.js'

function Entity({ entity }) {
  const entitySnap = useSnapshot(entity)
  console.log(Date.now(), 'RENDER ENTITY')
  function handleClick() {
    entity.randomizePosition()
  }
  return (
    <li>
      <div>{entitySnap.name}</div>
      <div>
        ({entitySnap.x}, {entitySnap.y})
      </div>
      <button onClick={handleClick}>Randomize Position</button>
    </li>
  )
}

export default function Home() {
  console.log(Date.now(), 'RENDER HOME')
  const gameSnap = useSnapshot(gameProxy)
  const handleAddEntity = () => {
    gameProxy.addEntity()
  }
  return (
    <div>
      <div>Number of entities: {gameSnap.entities.length}</div>
      <ul>
        {gameSnap.entities.map((entitySnap, i) => {
          return <Entity key={entitySnap.uuid} entity={gameProxy.entities[i]} />
        })}
      </ul>
      <div>
        <button onClick={handleAddEntity}>Add Entity</button>
      </div>
      <div style="background-color: yellow; padding: 8px;">
        PLEASE OPEN THE CONSOLE TO WATCH RE-RENDERS
      </div>
    </div>
  )
}
