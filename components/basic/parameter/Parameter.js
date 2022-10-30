import InputText, { InputBoolean } from '../input/Input'
import styles from './Parameter.module.sass'

export default function Parameter({ type, name }) {
  return (
    <div className={styles.parameter}>
      <div className={styles.pill} />
      <div className={styles.details}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.type}>{type}</p>
      </div>
    </div>
  )
}

export function ParameterInput({ name, type, value, setValue }) {
  return (
    <div className={styles.compound}>
      <div className={styles.param}>
        <Parameter name={name} type={type} />
      </div>

      <div className={`${styles.element} ${styles.input}`}>
        <InputText value={123} />
      </div>
    </div>
  )
}

export function ParameterDescription({ name, type, description }) {
  return (
    <div className={styles.compound}>
      <div className={styles.param}>
        <Parameter name={name} type={type} />
      </div>

      <div className={styles.divider} />

      <p className={styles.element}>{description}</p>
    </div>
  )
}