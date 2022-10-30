import { useState } from 'react'
import styles from './Tiles.module.sass'

export default function Tiles({ children }) {
  return (
    <div className={styles.tiles}>
      {children}
    </div>
  )
}

export function Tile({ active, text, leading, trailing, onClick }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={onClick}
      className={`${styles.tile} ${active ? styles.selected : styles.unselected}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {leading && <div className={styles.icon}>{leading}</div>}
      <h3>{text}</h3>
      <div className={styles.space}></div>
      {trailing && trailing.map((t, i) => (
        <div
          key={i}
          className={styles.icon}
          style={{ visibility: hover ? "visible" : "hidden" }}
        >{t}</div>
      ))}
    </div>
  )
}
