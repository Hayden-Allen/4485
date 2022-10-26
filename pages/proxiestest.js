import { useEffect, useRef, useState } from 'react'
import { useSnapshot } from 'valtio'

import { gameProxy } from '%proxies/proxies.js'

function SceneInfo({ sceneSnap }) {
  return (
    <div>
      You have added {sceneSnap.entities.length} entities. You&apos;re a
      {sceneSnap.entities.length > 0 ? (
        <span> winner!</span>
      ) : (
        <span> loser 💀💀💀</span>
      )}
    </div>
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
    gameProxy.currentScene.addControlledSceneEntity({
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
