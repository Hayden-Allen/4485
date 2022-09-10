import {
  EventScriptNodeTemplate,
  InternalScriptNodeTemplate,
  ScriptNodeTemplate,
  ConstantScriptNodeTemplate,
} from './ScriptNodeTemplate.js'
import { ScriptNodePort } from './ScriptNode.js'
import { Vec2 } from '%util/Vec2.js'

export class ScriptNodeTemplateBank {
  constructor() {
    // map name to template
    this.bank = new Map()
    this.init()
  }
  get(name) {
    return this.bank.get(name)
  }
  mapPorts(ports) {
    return ports.map(([name, type]) => new ScriptNodePort(name, type))
  }
  create(name, inputs, outputs, fn) {
    this.bank.set(
      name,
      new ScriptNodeTemplate(
        name,
        this.mapPorts(inputs),
        this.mapPorts(outputs),
        fn
      )
    )
  }
  createEvent(name) {
    this.bank.set(name, new EventScriptNodeTemplate(name))
  }
  createInternal(name, inputs, internals, outputs, fn) {
    this.bank.set(
      name,
      new InternalScriptNodeTemplate(
        name,
        this.mapPorts(inputs),
        this.mapPorts(internals),
        this.mapPorts(outputs),
        fn
      )
    )
  }
  createConstant(name, ports) {
    this.bank.set(
      name,
      new ConstantScriptNodeTemplate(name, this.mapPorts(ports))
    )
  }
  init() {
    this.createEvents()
    this.createInput()
    this.createMath()
    this.createLogic()
    this.createEntity()
  }
  createEvents() {
    this.createEvent('OnTick')
  }
  createInput() {
    this.createInternal(
      'KeyPressed',
      [],
      [['key', 'string']],
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
    this.createConstant('ConstInt', [['int', 'int']])
    // function
    this.create(
      'Subtract',
      [
        ['a', 'number'],
        ['b', 'number'],
      ],
      [['a-b', 'number']],
      ([a, b]) => [{ value: a - b }]
    )
    // vector
    this.create(
      'Vec2',
      [
        ['x', 'number'],
        ['y', 'number'],
      ],
      [['v', 'object']],
      ([x, y]) => [{ value: new Vec2(x, y) }]
    )
    this.create(
      'ScaleVec2',
      [
        ['v', 'object'],
        ['s', 'number'],
      ],
      [['v', 'object']],
      ([v, s]) => [{ value: v.scale(s) }]
    )
    this.create('Normalize', [['v', 'object']], [['n', 'object']], ([v]) => [
      { value: v.norm() },
    ])
  }
  createLogic() {
    this.create(
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
      'GetControlledEntity',
      [],
      [['entity', 'object']],
      (_, { entity }) => [{ value: entity }]
    )
    this.create(
      'SetEntityVelocity',
      [
        ['entity', 'object'],
        ['v', 'object'],
      ],
      [],
      // don't return anything
      ([entity, v]) => {
        entity.setVelocity(v)
      }
    )
  }
}
