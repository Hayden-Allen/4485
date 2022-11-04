import React from 'react'
import { Handle } from 'reactflow'
import styles from './ScriptNode.module.sass'

const getTypeColor = (type) => {
  switch (type) {
    case 'number':
      return '#FF5E00'
    case 'string':
      return '#C0FF00'
    case 'boolean':
      return '#FF0060'
    case 'any':
      return '#00FFF1'
    default:
      return '#00FFF1'
  }
}

export default function ScriptNode(props) {
  const { label, inputs, outputs, variables } = props.data

  return (
    <div className={styles.node}>
      {/* node content */}
      <div className={styles.content}>
        {inputs && <div className={styles.col}>
          {inputs.map(input => (
            <NodePort
              key={input.label}
              id={input.label}
              type='source'
              color={getTypeColor(input.type)}
              label={input.label}
            />
          ))}
        </div>}
        {variables && <div className={styles.col}>
          {variables.map(variable => (
            <NodeVariable
              key={variable.label}
              label={variable.label}
              initial={variable.default}
              type={variable.type}
            />
          ))}
        </div>}
        {outputs && <div className={styles.col}>
          {outputs.map(input => (
            <NodePort
              key={input.label}
              id={input.label}
              type='target'
              color={getTypeColor(input.type)}
              label={input.label}
            />
          ))}
        </div>}
      </div>
      {/* bottom label decoration */}
      <div className={styles.footer}>
        <div className={styles.flex}>
          <div className={styles.indicator}>
            <svg
              width='11'
              height='11'
              viewBox='0 0 10 11'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='5.02797'
                cy='5.56984'
                r='4.76332'
                fill='white'
                fillOpacity='0.2'
              />
            </svg>
          </div>
          <div className={styles.curve}>
            <svg
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0.87 0.33 18.65 18.48'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M19.5059 0.363672L19.399 0.363672C19.4687 0.362518 19.5059 0.363672 19.5059 0.363672ZM0.875861 0.363672L19.399 0.363672C18.4716 0.379016 11.88 0.592486 10.0532 9.55791C8.08907 19.1978 0.875861 18.7839 0.875861 18.7839V0.363672Z'
                fill='#1F1F1F'
              ></path>
            </svg>
          </div>
        </div>
        <div className={styles.flex}>
          <div className={styles.curve}>
            <svg
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0.62 0.43 18.65 18.43'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M0.620117 0.442957L0.727028 0.442957C0.657262 0.441803 0.620117 0.442957 0.620117 0.442957ZM19.2515 0.442957L0.727028 0.442957C1.65444 0.4583 8.24658 0.671771 10.0735 9.6372C12.0378 19.2771 19.2515 18.8632 19.2515 18.8632V0.442957Z'
                fill='#1F1F1F'
              />
            </svg>
          </div>
          <div className={styles.label}>
            <svg
              width='12'
              height='12'
              viewBox='0 0 12 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.22984 0.0691528C4.9105 0.0691528 5.46339 0.622047 5.46339 1.3027V10.1138C5.46339 10.7944 4.9105 11.3473 4.22984 11.3473C3.59324 11.3473 3.06899 10.8649 3.0029 10.2437C2.88836 10.2746 2.76721 10.29 2.64385 10.29C1.86628 10.29 1.23408 9.65778 1.23408 8.88021C1.23408 8.7172 1.26272 8.5586 1.31338 8.41322C0.648149 8.16211 0.176758 7.5189 0.176758 6.76555C0.176758 6.06287 0.588675 5.45491 1.18562 5.17296C0.993983 4.93286 0.881642 4.62887 0.881642 4.29846C0.881642 3.62221 1.35744 3.0583 1.99184 2.91953C1.95659 2.79838 1.93897 2.66841 1.93897 2.53625C1.93897 1.87762 2.39274 1.32253 3.0029 1.16833C3.06899 0.551558 3.59324 0.0691528 4.22984 0.0691528ZM7.40182 0.0691528C8.03842 0.0691528 8.56048 0.551558 8.62876 1.16833C9.24113 1.32253 9.6927 1.87542 9.6927 2.53625C9.6927 2.66841 9.67508 2.79838 9.63983 2.91953C10.2742 3.0561 10.75 3.62221 10.75 4.29846C10.75 4.62887 10.6377 4.93286 10.446 5.17296C11.043 5.45491 11.4549 6.06287 11.4549 6.76555C11.4549 7.5189 10.9835 8.16211 10.3183 8.41322C10.3689 8.5586 10.3976 8.7172 10.3976 8.88021C10.3976 9.65778 9.76539 10.29 8.98781 10.29C8.86446 10.29 8.74331 10.2746 8.62876 10.2437C8.56268 10.8649 8.03842 11.3473 7.40182 11.3473C6.72117 11.3473 6.16828 10.7944 6.16828 10.1138V1.3027C6.16828 0.622047 6.72117 0.0691528 7.40182 0.0691528Z'
                fill='white'
                fillOpacity='0.2'
              />
            </svg>
            <h3>{label}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

function NodePort({ id, type, label, color }) {
  return (
    <div className={styles.port}>
      {type == 'target' && (<h3 className={styles.label}>{label}</h3>)}
      <Handle
        className={styles.pill}
        style={{ backgroundColor: color }}
        type={type}
        id={id}
        position={type == 'source' ? 'left' : 'right'}
      />
      {type == 'source' && (<h3 className={styles.label}>{label}</h3>)}
    </div>
  )
}


function NodeVariable({ label, initial, type }) {
  return (
    <div className={styles.variable}>
      {/* // i wanted resizable input, input tag cant resize so i decided to use a div instead */}
      {label && <p>{label.toUpperCase()}</p>}
      <div contentEditable="true">{initial}</div>
      {/* // <input className={styles.variable} value={initial} type={type} id={label} name={label} placeholder={label} /> */}
    </div>
  )
}
