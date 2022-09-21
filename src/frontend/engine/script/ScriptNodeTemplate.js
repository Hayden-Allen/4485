import { ScriptNodeData } from './ScriptNodeData.js'
import { scriptDataType, validateScriptDataTypes } from './ScriptDataType.js'
import { ScriptNode } from './ScriptNode.js'

export class ScriptNodeTemplate extends ScriptNodeData {
  constructor(type, name, inputPorts, outputPorts, fn) {
    super(inputPorts, [], outputPorts, fn)
    this.type = type
    this.name = name
  }
  createNode(graph) {
    return new ScriptNode(
      this.type,
      this.name,
      graph,
      this.inputPorts,
      this.outputPorts,
      this.fn
    )
  }
}

// event script nodes only carry activation
// they are starting points for the graph
export class EventScriptNodeTemplate extends ScriptNodeTemplate {
  constructor(type, name, outputPorts) {
    // super(type, name, [], outputPorts, () =>
    //   outputPorts.map((port, i) => {
    //     return { value: this.outputValues[i], activate: true }
    //   })
    // )
    super(type, name, [], outputPorts, (_, { node }) =>
      node.outputs.map((value) => {
        return { value, activate: true }
      })
    )
  }
}

// for nodes that contain constant values, but also have regular inputs/outputs (ie, KeyPressed)
export class InternalScriptNodeTemplate extends ScriptNodeTemplate {
  constructor(
    type,
    name,
    inputPorts,
    internalPorts,
    defaultValues,
    outputPorts,
    fn
  ) {
    super(type, name, inputPorts, outputPorts, fn)
    this.internalPorts = internalPorts
    this.defaultValues = defaultValues
    this.internalTypes = internalPorts.map(
      (port) => scriptDataType[port.typename]
    )
  }
  createNode(graph, internalValues) {
    internalValues = internalValues || this.defaultValues
    if (!validateScriptDataTypes(internalValues, this.internalTypes)) {
      console.error('Invalid inputs')
      return
    }

    let node = new ScriptNode(
      this.type,
      this.name,
      graph,
      this.inputPorts,
      this.outputPorts,
      this.fn,
      { internalPorts: this.internalPorts, internalValues }
    )
    return node
  }
}

export class ConstantScriptNodeTemplate extends InternalScriptNodeTemplate {
  constructor(type, name, ports, defaultValues) {
    super(type, name, [], ports, defaultValues, ports, (_, { internal }) =>
      internal.map((value) => ({ value, activate: false }))
    )
  }
}
