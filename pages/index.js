import { useEffect, useState } from 'react'
import Editor from './editor'

export default function Home() {
  const [enable, setEnable] = useState(false)
  useEffect(() => {
    setEnable(true)
  }, [])
  return (
    <div className="h-screen w-screen flex flex-col">
      <Editor />
    </div>
  )
}
