import styles from './EntityManager.module.sass'
import { Activity, Trash2, Plus, Video } from 'react-feather';
import Section from '../../components/layout/section/Section';
import Tiles, { Tile } from '../../components/basic/tiles/Tiles';
import { AddButton } from '../../components/basic/button/Button';
import { ParameterInput } from '../../components/basic/parameter/Parameter';

export default function EntityManager() {
  return (
    <div className={styles.window}>
      {/* header */}
      <div className={styles.entity}>
        <div className={styles.image}></div>
        <Section title="entity">
          <h2 className={styles.name}>HERO_01</h2>
        </Section>
      </div>
      {/* content */}
      <div className={styles.content}>
        <Section title="states">
          {/* list */}
          {/* addbtn */}
          <Tiles>
            <Tile active text="Default" trailing={[(<Trash2 key={0} size={13} />)]} />
            <Tile text="Jumping" trailing={[(<Trash2 key={0} size={13} />)]} />
            <Tile text="Attacking" trailing={[(<Trash2 key={0} size={13} />)]} />
            <AddButton />
          </Tiles>
        </Section>
        <div className={styles.content_col}>
          <Section title="animation">
            <div className={styles.list}>
              <Tile
                text="Default"
                leading={(<Video key={0} size={13} />)}
              />
            </div>
          </Section>
          <Section title="scripts">
            <Tiles>
              <Tile
                active
                text="Default"
                leading={(<Activity key={0} size={13} color="#C5FF4A" />)}
                trailing={[(<Trash2 key={0} size={13} />)]} />
              <Tile
                text="Jumping"
                leading={(<Activity key={0} size={13} color="#C5FF4A" />)}
                trailing={[(<Trash2 key={0} size={13} />)]} />
              <Tile
                text="Attacking"
                leading={(<Activity key={0} size={13} color="#C5FF4A" />)}
                trailing={[(<Trash2 key={0} size={13} />)]} />
              <AddButton />
            </Tiles>
          </Section>
        </div>
        <Section title="parameters">
          <div className={`${styles.list} ${styles.parameters}`}>
            <ParameterInput name="keyLeft" type="string"></ParameterInput>
            <ParameterInput name="keyRight" type="string"></ParameterInput>
            <ParameterInput name="slowFall" type="boolean"></ParameterInput>
          </div>
        </Section>
      </div>
    </div>
  )
}

export function TileAdd({ onClick }) {
  return (
    <div onClick={onClick} className={styles.button}>
      <div className={styles.icon}><Plus size={13} color="white" /></div>
    </div>
  )
}


// export function Parameter({ type, name, initial }) {
//   return (
//     <div className={styles.parameter}>
//       <div className={styles.pill} />
//       <div className={styles.details}>
//         <h2 className={styles.name}>{name}</h2>
//         <p className={styles.type}>{type}</p>
//       </div>
//       <div className={styles.space} />
//       <div className={styles.value}>
//         {/* // i wanted resizable input, input tag cant resize so i decided to use a div instead */}
//         <div contentEditable="true">{initial}</div>
//         {/* // <input className={styles.variable} value={initial} type={type} id={label} name={label} placeholder={label} /> */}
//       </div>
//     </div>
//   )
// }