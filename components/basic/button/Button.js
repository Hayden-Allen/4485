import styles from './Button.module.sass'
import { ArrowRight, Plus } from 'react-feather';

export default function Button({ label, icon, onClick, stretch }) {
  return (
    <button className={`${styles.btn} ${stretch && styles.stretch}`} onClick={onClick}>
      {label && <h3 className={styles.label}>{label}</h3>}
      {icon}
    </button>
  )
}

export function AddButton({ label, onClick, stretch }) {
  return (
    <Button
      label={label}
      onClick={onClick}
      stretch={stretch}
      icon={<Plus size={14}></Plus>}
    />
  )
}

export function ForwardButton({ label, onClick, stretch }) {
  return (
    <Button
      label={label}
      onClick={onClick}
      stretch={stretch}
      icon={<ArrowRight size={14}></ArrowRight>}
    />
  )
}
