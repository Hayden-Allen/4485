import { useEffect, useRef } from 'react'
import { useSnapshot } from 'valtio'

import { gameProxy } from '%proxies/proxies.js'

function EntityInfo({ entity }) {
  const entitySnap = useSnapshot(entity)

  function handleResetPosition() {
    entity.setX(entity.x.default)
    entity.setY(entity.y.default)
  }

  function handleDelete() {
    gameProxy.currentScene.removeEntity({ id: entity.id })
  }

  function handleAddScript() {
    entity.states[0].addScript({
      name: 'Test Script',
      nodes: [],
      edges: [],
    })
  }

  return (
    <li>
      <div>X: {entitySnap.x.current}</div>
      <div>Y: {entitySnap.y.current}</div>
      <div>Scripts: {entitySnap.states[0].scripts.length}</div>
      <div>
        <button onClick={handleResetPosition}>Reset Position</button>{' '}
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleAddScript}>Add Script</button>
      </div>
    </li>
  )
}

function SceneInfo({ sceneSnap }) {
  return (
    <ul>
      {sceneSnap.entities.map((entitySnap, i) => {
        return (
          <EntityInfo
            key={entitySnap.id}
            entity={gameProxy.currentScene.entities[i]}
          />
        )
      })}
    </ul>
  )
}

export default function Editor() {
  const gameCanvasRef = useRef(null)
  const uiCanvasRef = useRef(null)

  useEffect(() => {
    if (gameCanvasRef.current && uiCanvasRef.current) {
      gameProxy.init(gameCanvasRef.current, uiCanvasRef.current)
    }
  }, [gameCanvasRef, uiCanvasRef])

  function handleAddEntity() {
    gameProxy.currentScene.addControlledEntity({
      x: Math.random() * 640 - 320,
      y: Math.random() * 240,
      z: 0,
    })
  }

  const gameSnap = useSnapshot(gameProxy)
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ width: '800px', height: '450px', position: 'relative' }}>
        <canvas
          ref={gameCanvasRef}
          width='1920'
          height='1080'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        ></canvas>
        <canvas
          ref={uiCanvasRef}
          width='1920'
          height='1080'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        ></canvas>
      </div>
      <div>
        <button onClick={handleAddEntity}>Add Entity</button>
        {gameSnap.currentScene && (
          <SceneInfo sceneSnap={gameSnap.currentScene} />
        )}
      </div>
    </div>
  )
}
