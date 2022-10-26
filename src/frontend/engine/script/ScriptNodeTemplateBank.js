import {
  EventScriptNodeTemplate,
  InternalScriptNodeTemplate,
  ScriptNodeTemplate,
  ConstantScriptNodeTemplate,
  ExportNodeTemplate,
} from './ScriptNodeTemplate.js'
import { ScriptNodePort } from './ScriptNode.js'
import { Vec2 } from '%util/Vec2.js'
import { global } from '%engine/Global.js'

export const NODE_CATEGORY_COLORS = {
  all: {
    bgColor: '#d4d4d4',
    borderColor: '#737373',
  },
  logic: {
    bgColor: '#0ea5e9',
    borderColor: '#0369a1',
  },
  event: {
    bgColor: '#eab308',
    borderColor: '#a16207',
  },
  input: {
    bgColor: '#eab308',
    borderColor: '#a16207',
  },
  math: {
    bgColor: '#f59e0b',
    borderColor: '#b45309',
  },
  entity: {
    bgColor: '#22c55e',
    borderColor: '#15803d',
  },
  audio: {
    bgColor: '#22c55e',
    borderColor: '#15803d',
  },
}

class ScriptNodeTemplateBank {
  constructor() {
    // map name to template
    this.bank = new Map()
    this.init()
  }
  getNodeTypeNames() {
    return [...this.bank.keys()].sort()
  }
  get(name) {
    return this.bank.get(name)
  }
  mapPorts(ports) {
    return ports.map(
      ([name, type, editorType]) => new ScriptNodePort(name, type, editorType)
    )
  }
  create(category, name, inputs, outputs, fn) {
    this.bank.set(
      name,
      new ScriptNodeTemplate(
        category,
        name,
        this.mapPorts(inputs),
        this.mapPorts(outputs),
        fn
      )
    )
  }
  createEvent(category, name, outputs) {
    this.bank.set(
      name,
      new EventScriptNodeTemplate(category, name, this.mapPorts(outputs))
    )
  }
  createInternal(
    category,
    name,
    inputs,
    internals,
    defaultValues,
    outputs,
    fn
  ) {
    this.bank.set(
      name,
      new InternalScriptNodeTemplate(
        category,
        name,
        this.mapPorts(inputs),
        this.mapPorts(internals),
        defaultValues,
        this.mapPorts(outputs),
        fn
      )
    )
  }
  createConstant(category, name, ports, defaultValues) {
    this.bank.set(
      name,
      new ConstantScriptNodeTemplate(
        category,
        name,
        this.mapPorts(ports),
        defaultValues
      )
    )
  }
  createExport(
    category,
    name,
    valueName,
    value,
    valueType,
    {
      additionalPorts = [],
      additionalValues = [],
      valueEditorType = valueType,
    } = {}
  ) {
    this.bank.set(
      name,
      new ExportNodeTemplate(
        category,
        name,
        valueName,
        value,
        valueType,
        valueEditorType,
        this.mapPorts(additionalPorts),
        additionalValues
      )
    )
  }
  init() {
    this.createEntity()
    this.createEvents()
    this.createInput()
    this.createLogic()
    this.createMath()
    this.createExports()
    this.createAudio()
    /**
     * @HATODO remove
     */
    this.createInternal(
      'logic',
      '__debug',
      [],
      [['msg', 'string']],
      ['debug'],
      [],
      (_, { internal, entity }) => {
        entity.logInfo(internal[0])
      }
    )
  }
  createEvents() {
    this.createEvent('event', 'OnTick', [])
    this.createEvent('event', 'OnRender', [])
    this.createEvent('event', 'OnCollide', [
      ['normal', 'object'],
      ['entity', 'object'],
    ])
    this.createEvent('event', 'OnSwitch', [])
  }
  createInput() {
    this.createInternal(
      'input',
      'KeyPressed',
      [],
      [['key', 'string', 'key']],
      ['A'],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      (_, { internal, input }) => {
        const pressed = input.isKeyPressed(internal[0])
        return [
          { value: pressed, active: pressed },
          { value: !pressed, active: !pressed },
          { value: ~~pressed },
        ]
      }
    )
    this.create(
      'input',
      'VarKeyPressed',
      [['key', 'string']],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([key], { input }) => {
        const pressed = input.isKeyPressed(key)
        return [
          { value: pressed, active: pressed },
          { value: !pressed, active: !pressed },
          { value: ~~pressed },
        ]
      }
    )
    this.create(
      'input',
      'MouseScroll',
      [],
      [['v', 'object']],
      (_, { input }) => [{ value: input.mouseScroll }]
    )
  }
  createMath() {
    // const
    this.createConstant('math', 'ConstInt', [['int', 'int']], [0])
    this.createConstant('math', 'ConstFloat', [['float', 'float']], [0])
    // function
    this.create(
      'math',
      'Subtract',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [['a-b', 'number']],
      ([a, b]) => [{ value: a - b }]
    )
    this.create(
      'math',
      'Multiply',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [['a*b', 'number']],
      ([a, b]) => [{ value: a * b }]
    )
    this.create(
      'math',
      'Min',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [['min', 'number']],
      ([a, b]) => [{ value: Math.min(a, b) }]
    )
    this.create(
      'math',
      'Max',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [['max', 'number']],
      ([a, b]) => [{ value: Math.max(a, b) }]
    )
    this.create(
      'math',
      'Clamp',
      [
        ['x', 'number'],
        ['min', 'number'],
        ['max', 'number'],
      ],
      [['clamped', 'number']],
      ([x, min, max]) => [{ value: global.clamp(x, min, max) }]
    )
    this.create(
      'math',
      'Negative',
      [['x', 'number']],
      [['-x', 'number']],
      ([x]) => [{ value: -x }]
    )
    this.create(
      'math',
      'Equals',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a, b]) => {
        const equal = a == b
        return [
          { value: equal, active: equal },
          { value: !equal, active: !equal },
          { value: ~~equal },
        ]
      }
    )
    this.createInternal(
      'math',
      'EqualsConst',
      [['a', 'number']],
      [['b', 'number']],
      [0],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a], { internal }) => {
        const equal = a == internal[0]
        return [
          { value: equal, active: equal },
          { value: !equal, active: !equal },
          { value: ~~equal },
        ]
      }
    )

    // comparison
    this.create(
      'math',
      'Greater',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a, b]) => {
        const r = a > b
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r },
        ]
      }
    )
    this.create(
      'math',
      'GreaterEquals',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a, b]) => {
        const r = a >= b
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r },
        ]
      }
    )
    this.create(
      'math',
      'Less',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a, b]) => {
        const r = a < b
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r },
        ]
      }
    )
    this.createInternal(
      'math',
      'LessConst',
      [['a', 'number']],
      [['b', 'number']],
      [0],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a], { internal }) => {
        const r = a < internal[0]
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r },
        ]
      }
    )
    this.createInternal(
      'math',
      'Less#',
      [['a', 'number']],
      [['b', 'number']],
      [0],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a], { internal }) => {
        const r = a < internal[0]
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r },
        ]
      }
    )
    this.create(
      'math',
      'LessEquals',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a, b]) => {
        const r = a <= b
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r },
        ]
      }
    )
    this.create(
      'math',
      'IsZero',
      [['a', 'number']],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a]) => {
        const r = Math.abs(a) <= global.epsilon
        // console.log(a)
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r },
        ]
      }
    )
    this.create(
      'math',
      'IsNonZero',
      [['a', 'number']],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a]) => {
        const r = Math.abs(a) > global.epsilon
        return [
          { value: r, active: r },
          { value: !r, active: !r },
          { value: ~~r },
        ]
      }
    )

    // vector
    /**
     * @HATODO debug only
     */
    this.create('math', 'PrintVec2', [['v', 'object']], [], ([v]) => {
      console.log(v)
    })
    this.create(
      'math',
      'Vec2',
      [
        ['x', 'number'],
        ['y', 'number'],
      ],
      [['v', 'object']],
      ([x, y]) => {
        return [{ value: new Vec2(x, y) }]
      }
    )
    this.create(
      'math',
      'Vec2Components',
      [['v', 'object']],
      [
        ['x', 'number'],
        ['y', 'number'],
      ],
      ([v]) => [{ value: v.x }, { value: v.y }]
    )
    this.create(
      'math',
      'ScaleVec2',
      [
        ['v', 'object'],
        ['s', 'number'],
      ],
      [['v', 'object']],
      ([v, s]) => [{ value: v.scale(s) }]
    )
    this.create(
      'math',
      'ClampVec2',
      [
        ['v', 'object'],
        ['min', 'number'],
        ['max', 'number'],
      ],
      [['v', 'object']],
      ([v, min, max]) => {
        const l2 = v.lengthSquared()
        if (l2 < min * min) {
          v.normalize().scaleEqual(min)
        } else if (l2 > max * max) {
          v.normalize().scaleEqual(max)
        }

        return [{ value: v }]
      }
    )
    this.create(
      'math',
      'Normalize',
      [['v', 'object']],
      [['n', 'object']],
      ([v]) => [{ value: v.norm() }]
    )
    this.create(
      'math',
      'Vec2Equals',
      [
        ['v1', 'object'],
        ['v2', 'object'],
      ],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([v1, v2]) => {
        const equal = v1.equals(v2)
        return [
          { value: equal, active: equal },
          { value: !equal, active: !equal },
          { value: ~~equal },
        ]
      }
    )
    this.createInternal(
      'math',
      'ConstVec2',
      [],
      [
        ['x', 'number'],
        ['y', 'number'],
      ],
      [0, 0],
      [['v', 'object']],
      (_, { internal }) => [{ value: new Vec2(internal[0], internal[1]) }]
    )
  }
  createLogic() {
    this.create(
      'logic',
      'AND',
      [
        ['a', 'any'],
        ['b', 'any'],
      ],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a, b]) => {
        const and = a && b
        return [
          { value: and, active: and },
          { value: !and, active: !and },
          { value: ~~and },
        ]
      }
    )
    this.create(
      'logic',
      'OR',
      [
        ['a', 'any'],
        ['b', 'any'],
      ],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a, b]) => {
        const or = a || b
        return [
          { value: or, active: or },
          { value: !or, active: !or },
          { value: ~~or },
        ]
      }
    )
    this.create(
      'logic',
      'XOR',
      [
        ['a', 'any'],
        ['b', 'any'],
      ],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a, b]) => {
        const xor = a ^ b
        return [
          { value: xor, active: xor },
          { value: !xor, active: !xor },
          { value: ~~xor },
        ]
      }
    )
    this.create(
      'logic',
      'NOT',
      [['a', 'any']],
      [
        ['T', 'bool'],
        ['F', 'bool'],
        ['int', 'int'],
      ],
      ([a]) => {
        const not = !a
        return [
          { value: not, active: not },
          { value: !not, active: !not },
          { value: ~~not },
        ]
      }
    )
    this.create(
      'logic',
      'Mux2',
      [
        ['index', 'int'],
        ['0', 'any'],
        ['1', 'any'],
      ],
      [['out', 'any']],
      ([index, a0, a1]) => [{ value: index ? a1 : a0 }]
    )
  }
  createEntity() {
    this.create(
      'entity',
      'GetControlledEntity',
      [],
      [['entity', 'object']],
      (_, { entity }) => [{ value: entity }]
    )
    this.create(
      'entity',
      'SetEntityVelocity',
      [
        ['entity', 'object'],
        ['v', 'object'],
      ],
      [],
      ([entity, v]) => {
        if (entity.setVelocity) {
          entity.setVelocity(v)
        }
      }
    )
    this.create(
      'entity',
      'SetEntityVelocityX',
      [
        ['entity', 'object'],
        ['x', 'number'],
      ],
      [],
      ([entity, x]) => {
        if (entity.setVelocity) {
          entity.setVelocityX(x)
          // console.log(entity.physicsProxy.velocity)
        }
      }
    )
    this.create(
      'entity',
      'SetEntityVelocityY',
      [
        ['entity', 'object'],
        ['y', 'number'],
      ],
      [],
      ([entity, y]) => {
        if (entity.setVelocity) {
          entity.setVelocityY(y)
        }
      }
    )
    this.create(
      'entity',
      'ApplyEntityForce',
      [
        ['entity', 'object'],
        ['force', 'object'],
      ],
      [],
      ([entity, force]) => {
        entity.applyForce(force)
      }
    )
    this.create(
      'entity',
      'GetEntityVelocity',
      [['entity', 'object']],
      [['v', 'object']],
      ([entity]) => {
        const { x, y } = entity.getVelocity()
        return [{ value: new Vec2(x, y) }]
      }
    )
    this.create(
      'entity',
      'GetEntityVelocityX',
      [['entity', 'object']],
      [['x', 'number']],
      ([entity]) => [{ value: entity.physicsProxy.velocity.x }]
    )
    this.create(
      'entity',
      'GetControlledEntityVelocityX',
      [],
      [['x', 'number']],
      (_, { entity }) => [{ value: entity.physicsProxy.velocity.x }]
    )
    this.create(
      'entity',
      'ControlledVelX',
      [],
      [['x', 'number']],
      (_, { entity }) => [{ value: entity.physicsProxy.velocity.x }]
    )
    this.create(
      'entity',
      'GetEntityVelocityY',
      [['entity', 'object']],
      [['y', 'number']],
      ([entity]) => [{ value: entity.physicsProxy.velocity.y }]
    )
    this.create(
      'entity',
      'GetEntityVelocityXY',
      [['entity', 'object']],
      [
        ['x', 'number'],
        ['y', 'number'],
      ],
      ([entity]) => {
        const { x, y } = entity.getVelocity()
        console.log(x, y)
        return [{ value: x }, { value: y }]
      }
    )
    this.create(
      'entity',
      'SetEntityScale',
      [
        ['entity', 'object'],
        ['scale', 'number'],
      ],
      [],
      ([entity, s]) => {
        entity.setScale(s)
      }
    )
    this.create(
      'entity',
      'SetEntityState',
      [
        ['entity', 'object'],
        ['state', 'string'],
      ],
      [],
      ([entity, state]) => {
        entity.setState(state)
      }
    )
    this.create(
      'entity',
      'DestroyEntity',
      [['entity', 'object']],
      [],
      ([entity], { scene }) => {
        scene.removeControlledEntity(entity)
      }
    )
    this.create(
      'entity',
      'GetEntityPosition',
      [['entity', 'object']],
      [['pos', 'object']],
      ([entity]) => [{ value: entity.pos }]
    )
    this.create(
      'entity',
      'SetCameraPosition',
      [['pos', 'object']],
      [],
      ([pos], { camera }) => {
        camera.setPosition(pos)
      }
    )
    this.create(
      'entity',
      'SetCameraZoom',
      [['zoom', 'number']],
      [],
      ([zoom], { camera }) => {
        camera.setZoom(zoom)
      }
    )
    this.createInternal(
      'entity',
      'SetEntityAnimation',
      [
        ['entity', 'object'],
        ['index', 'int'],
      ],
      [['reset', 'bool']],
      [true],
      [],
      ([entity, index], { internal }) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(index, internal[0])
        }
      }
    )
    this.createInternal(
      'entity',
      'SetEntityAnimationConst',
      [['entity', 'object']],
      [
        ['index', 'int'],
        ['reset', 'bool'],
      ],
      [4, true],
      [],
      ([entity], { internal }) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(internal[0], internal[1])
        }
      }
    )
    this.createInternal(
      'entity',
      'SetControlledEntityAnimation',
      [['index', 'int']],
      [['reset', 'bool']],
      [true],
      [],
      ([index], { entity, internal }) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(index, internal[0])
        }
      }
    )
    this.createInternal(
      'entity',
      'SetControlledEntityAnimationConst',
      [],
      [
        ['index', 'int'],
        ['reset', 'bool'],
      ],
      [4, true],
      [],
      (_, { entity, internal }) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(internal[0], internal[1])
        }
      }
    )
    this.createInternal(
      'entity',
      'SetControlledAnimation#',
      [],
      [['index', 'int']],
      [4],
      [],
      (_, { entity, internal }) => {
        if (entity.setAnimationIndex) {
          entity.setAnimationIndex(internal[0])
        }
      }
    )
  }
  createExports() {
    this.createExport('math', 'ExportInt', 'value', 0, 'int')
    this.createExport('math', 'ExportIntRange', 'value', 0, 'int', {
      additionalPorts: [
        ['min', 'int'],
        ['max', 'int'],
      ],
      additionalValues: [0, 10],
    })
    this.createExport('math', 'ExportFloat', 'value', 0, 'float')
    this.createExport('input', 'ExportKey', 'key', 'A', 'string', {
      valueEditorType: 'key',
    })

    this.createExport('entity', 'ExportState', 'state', '---', 'string', {
      valueEditorType: 'state',
    })
  }
  createAudio() {
    this.createInternal(
      'audio',
      'PlaySound',
      [],
      [['name', 'string']],
      ['boink'],
      [],
      (_, { internal }) => {
        global.playSound(internal[0])
      }
    )
    this.create(
      'entity',
      'SetEntityVelocityX',
      [
        ['entity', 'object'],
        ['x', 'number'],
      ],
      [],
      ([entity, x]) => {
        if (entity.setVelocity) {
          entity.setVelocityX(x)
          // console.log(entity.physicsProxy.velocity)
        }
      }
    )
    this.create(
      'entity',
      'SetEntityVelocityY',
      [
        ['entity', 'object'],
        ['y', 'number'],
      ],
      [],
      ([entity, y]) => {
        if (entity.setVelocity) {
          entity.setVelocityY(y)
        }
      }
    )
    this.create(
      'entity',
      'ApplyEntityForce',
      [
        ['entity', 'object'],
        ['force', 'object'],
      ],
      [],
      ([entity, force]) => {
        entity.applyForce(force)
      }
    )
    this.create(
      'entity',
      'GetEntityVelocity',
      [['entity', 'object']],
      [['v', 'object']],
      ([entity]) => {
        const { x, y } = entity.getVelocity()
        return [{ value: new Vec2(x, y) }]
      }
    )
    this.create(
      'entity',
      'SetEntityScale',
      [
        ['entity', 'object'],
        ['scale', 'number'],
      ],
      [],
      ([entity, s]) => {
        entity.setScale(s)
      }
    )
    this.create(
      'entity',
      'SetEntityState',
      [
        ['entity', 'object'],
        ['state', 'string'],
      ],
      [],
      ([entity, state]) => {
        entity.setState(state)
      }
    )
    this.create(
      'entity',
      'DestroyEntity',
      [['entity', 'object']],
      [],
      ([entity], { scene }) => {
        scene.removeControlledEntity(entity)
      }
    )
    this.create(
      'entity',
      'GetEntityPosition',
      [['entity', 'object']],
      [['pos', 'object']],
      ([entity]) => [{ value: entity.pos }]
    )
    this.create(
      'entity',
      'SetCameraPosition',
      [['pos', 'object']],
      [],
      ([pos], { camera }) => {
        camera.setPosition(pos)
      }
    )
    this.create(
      'entity',
      'SetCameraZoom',
      [['zoom', 'number']],
      [],
      ([zoom], { camera }) => {
        camera.setZoom(zoom)
      }
    )
  }
  createExports() {
    this.createExport('math', 'ExportInt', 'value', 0, 'int')
    this.createExport('math', 'ExportIntRange', 'value', 0, 'int', {
      additionalPorts: [
        ['min', 'int'],
        ['max', 'int'],
      ],
      additionalValues: [0, 10],
    })
    this.createExport('math', 'ExportFloat', 'value', 0, 'float')
    this.createExport('input', 'ExportKey', 'key', 'A', 'string', {
      valueEditorType: 'key',
    })

    this.createExport('entity', 'ExportState', 'state', '---', 'string', {
      valueEditorType: 'state',
    })
  }
}

export const scriptNodeTemplateBank = new ScriptNodeTemplateBank()
