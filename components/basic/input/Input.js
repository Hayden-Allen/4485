import styles from './Input.module.sass'

export default function InputText({ label, initial }) {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
      <input
        className={styles.input}
        type="number"
        defaultValue={initial}
      />
    </div>
  )
}


export function InputBoolean({ label, initial }) {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
      <input
        type="checkbox"
        defaultValue={initial}
      />
    </div>
  )
}
