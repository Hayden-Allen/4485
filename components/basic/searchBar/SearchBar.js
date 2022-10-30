import styles from './SearchBar.module.sass'
export default function SearchBar({ value, updateValue }) {
  return (
    <input
      className={styles.bar}
      type="text"
      placeholder='search'
      value={value}
      onInput={updateValue}
    />
  )
}
