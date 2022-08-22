import { ScriptNodeData } from './ScriptNodeData.js'
import {
  scriptDataType,
  validateScriptDataTypes,
  ScriptDataTypeList,
} from './ScriptDataType.js'
import { ScriptNode } from './ScriptNode.js'

export class ScriptNodeTemplate extends ScriptNodeData {
  constructor(name, inPorts, outPorts, fn) {
    super(
      new ScriptDataTypeList(inPorts.map((port) => port.typename)),
      new ScriptDataTypeList(outPorts.map((port) => port.typename)),
      fn
    )
    this.name = name
  }
  createNode(graph) {
    return new ScriptNode(
      this.name,
      graph,
      this.inputTypes,
      this.outputTypes,
      this.fn
    )
  }
}

// event script nodes only carry activation
// they are starting points for the graph
export class EventScriptNodeTemplate extends ScriptNodeTemplate {
  constructor(name) {
    super(name, [], [], () => [])
  }
}

// for nodes that contain constant values, but also have regular inputs/outputs (ie, KeyPressed)
export class InternalScriptNodeTemplate extends ScriptNodeTemplate {
  constructor(name, inPorts, internalPorts, outPorts, fn) {
    super(name, inPorts, outPorts, fn)
    this.internalTypes = internalPorts.map(
      (port) => scriptDataType[port.typename]
    )
  }
  createNode(graph, internalValues) {
    if (!validateScriptDataTypes(internalValues, this.internalTypes)) {
      console.error('Invalid inputs')
      return
    }

    let node = new ScriptNode(
      this.name,
      graph,
      this.inputTypes,
      this.outputTypes,
      this.fn
    )

    node.internal = internalValues
    return node
  }
}

export class ConstantScriptNodeTemplate extends InternalScriptNodeTemplate {
  constructor(name, ports) {
    super(name, [], ports, ports, (_, { internal }) =>
      internal.map((value) => ({ value, activate: false }))
    )
  }
}