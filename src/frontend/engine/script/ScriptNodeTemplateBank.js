import {
  EventScriptNodeTemplate,
  InternalScriptNodeTemplate,
  ScriptNodeTemplate,
  ConstantScriptNodeTemplate,
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
  create(type, name, inputs, outputs, fn) {
    this.bank.set(
      name,
      new ScriptNodeTemplate(
        type,
        name,
        this.mapPorts(inputs),
        this.mapPorts(outputs),
        fn
      )
    )
  }
  createEvent(type, name, outputs) {
    this.bank.set(
      name,
      new EventScriptNodeTemplate(type, name, this.mapPorts(outputs))
    )
  }
  createInternal(type, name, inputs, internals, defaultValues, outputs, fn) {
    this.bank.set(
      name,
      new InternalScriptNodeTemplate(
        type,
        name,
        this.mapPorts(inputs),
        this.mapPorts(internals),
        defaultValues,
        this.mapPorts(outputs),
        fn
      )
    )
  }
  createConstant(type, name, ports, defaultValues) {
    this.bank.set(
      name,
      new ConstantScriptNodeTemplate(
        type,
        name,
        this.mapPorts(ports),
        defaultValues
      )
    )
  }
  init() {
    this.createEntity()
    this.createEvents()
    this.createInput()
    this.createLogic()
    this.createMath()
    this.createExport()
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
      ([x, y]) => [{ value: new Vec2(x, y) }]
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
  createExport() {
    this.createInternal(
      'math',
      'ExportInt',
      [],
      [
        ['min', 'int'],
        ['max', 'int'],
        ['default', 'int'],
      ],
      [0, 10, 5],
      [['cur', 'int']],
      (_, { entity, internal }) => {
        if (entity.__export_current === undefined)
          entity.__export_current = internal[2]
        let cur = global.clamp(
          entity.__export_current,
          internal[0],
          internal[1]
        )
        return [{ value: cur }]
      }
    )
  }
}

export const scriptNodeTemplateBank = new ScriptNodeTemplateBank()
