import { useEffect, useState } from 'react'
import Split from 'react-split'
import Icon from '../components/icon/Icon'
import TabSystem from '../components/layout/tabs/TabSystem'
import EntityManager from '../panels/EntityManager/EntityManager'
import ScriptGraph from '../panels/ScriptGraph/ScriptGraph'
import ScriptLibrary from '../panels/ScriptLibrary/ScriptLibrary'
import styles from '../styles/pages/Editor.module.sass'

export default function Editor() {
  const [enable, setEnable] = useState(false)

  useEffect(() => {
    setEnable(true)
  }, [])

  return enable ? (
    <Split direction='vertical' sizes={[50, 50]} className={styles.vertical}>
      <Split className={styles.horizontal}>
        <TabSystem initialTabs={[]} />
        <TabSystem initialTabs={[]} />
      </Split>
      <Split className={styles.horizontal}>
        <TabSystem initialTabs={[
          {
            title: "SCRIPT LIBRARY",
            icon: <Icon size={13} icon="Text" />,
            component: <ScriptLibrary />
          }
        ]} />
        <TabSystem initialTabs={[
          {
            title: "SCRIPT GRAPH",
            icon: <Icon size={13} icon="Connection" />,
            component: <ScriptGraph />
          },
          {
            title: "ENTITY MANAGER",
            icon: <Icon size={13} icon="Sliders" />,
            component: <EntityManager />
          }
        ]} />
      </Split>
    </Split>
  ) : <></>
}
