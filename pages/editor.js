import { useEffect, useState } from 'react'
import Split from 'react-split'
import TabSystem from '../components/basic/TabSystem'
import Graph from '../panels/Graph'

export default function Editor() {
  const [enable, setEnable] = useState(false)

  useEffect(() => {
    setEnable(true)
  }, [])

  return enable ? (
    <Split direction='vertical' sizes={[50, 50]} className='h-full bg-bg p-2'>
      <Split className='flex'>
        <TabSystem initialTabs={[]} />
        <TabSystem initialTabs={[]} />
      </Split>
      <Split className='flex'>
        <TabSystem initialTabs={[
          {
            title: "SCRIPT LIBRARY",
            icon: "svg",
            component: <>Script library</>
          }
        ]} />
        <TabSystem initialTabs={[
          {
            title: "NODE GRAPH",
            icon: "svg",
            component: <Graph />
          },
          {
            title: "STATE MANAGER",
            icon: "svg",
            component: <>STATE MANAGER</>
          }
        ]} />
      </Split>
    </Split>
  ) : <></>
}
