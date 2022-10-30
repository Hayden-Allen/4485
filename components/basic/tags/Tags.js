import styles from './Tags.module.sass'

export default function Tags({ children }) {
  return (
    <div className={styles.tags}>
      {children}
    </div>
  )
}

export function Tag({ color, label }) {
  return (
    <div className={styles.tag} style={{ backgroundColor: color }}>
      {label}
    </div>
  )
}