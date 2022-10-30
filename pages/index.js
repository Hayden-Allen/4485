import { useEffect, useState } from 'react'
import Editor from './editor'
import styles from '../styles/pages/Home.module.sass'

export default function Home() {
  const [enable, setEnable] = useState(false)
  useEffect(() => {
    setEnable(true)
  }, [])
  return (
    <div className={styles.window}>
      <Editor />
    </div>
  )
}
