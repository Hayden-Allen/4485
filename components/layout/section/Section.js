import styles from './Section.module.sass'

export default function Section({ title, children, className }) {
  return (
    <div className={`${styles.section} ${className}`}>
      <h3 className={styles.title}>
        {title.toUpperCase()}
      </h3>
      {children}
    </div>
  )
}
