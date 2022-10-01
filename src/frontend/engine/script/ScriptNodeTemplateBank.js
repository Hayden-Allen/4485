import {
  EventScriptNodeTemplate,
  InternalScriptNodeTemplate,
  ScriptNodeTemplate,
  ConstantScriptNodeTemplate,
  ExportNodeTemplate,
} from './ScriptNodeTemplate.js'
import { ScriptNodePort } from './ScriptNode.js'
import { Vec2 } from '%util/Vec2.js'

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
  create(category, name, inputs, outputs, fn, isExport = false) {
    this.bank.set(
      name,
      new ScriptNodeTemplate(
        category,
        name,
        this.mapPorts(inputs),
        this.mapPorts(outputs),
        fn,
        isExport
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
    fn,
    isExport = false
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
        fn,
        isExport
      )
    )
  }
  createConstant(category, name, ports, defaultValues, isExport = false) {
    this.bank.set(
      name,
      new ConstantScriptNodeTemplate(
        category,
        name,
        this.mapPorts(ports),
        defaultValues,
        isExport
      )
    )
  }
  createExport(
    category,
    name,
    value,
    valueName,
    valueType,
    { additionalPorts = [], additionalValues = [] } = {}
  ) {
    this.bank.set(
      name,
      new ExportNodeTemplate(
        category,
        name,
        value,
        valueName,
        valueType,
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
  }
  createEvents() {
    this.createEvent('event', 'OnTick', [])
    this.createEvent('event', 'OnCollide', [
      ['normal', 'object'],
      ['entity', 'object'],
    ])
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
    this.createInternal(
      'input',
      'ExportKey',
      [],
      [
        ['name', 'string'],
        ['key', 'string', 'key'],
      ],
      ['export', 'a'],
      [['key', 'string']],
      (_, { internal }) => [{ value: internal[1] }],
      true
    )
  }
  createMath() {
    // const
    this.createConstant('math', 'ConstInt', [['int', 'int']], [0])
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
      'Normalize',
      [['v', 'object']],
      [['n', 'object']],
      ([v]) => [{ value: v.norm() }]
    )
  }
  createLogic() {
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
      ([entity]) => [{ value: entity.physicsProxy.velocity }]
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
  }
}

export const scriptNodeTemplateBank = new ScriptNodeTemplateBank()
