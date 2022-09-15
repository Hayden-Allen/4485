import { ScriptNodeData } from './ScriptNodeData.js'
import { scriptDataType, validateScriptDataTypes } from './ScriptDataType.js'
import { ScriptNode } from './ScriptNode.js'

export class ScriptNodeTemplate extends ScriptNodeData {
  constructor(type, name, inputPorts, outputPorts, fn) {
    /**
     * @HATODO cleanup
     */
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
  constructor(type, name) {
    super(type, name, [], [], () => [])
  }
}

// for nodes that contain constant values, but also have regular inputs/outputs (ie, KeyPressed)
export class InternalScriptNodeTemplate extends ScriptNodeTemplate {
  constructor(type, name, inputPorts, internalPorts, outputPorts, fn) {
    super(type, name, inputPorts, outputPorts, fn)
    this.internalPorts = internalPorts
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
  constructor(type, name, ports) {
    super(type, name, [], ports, ports, (_, { internal }) =>
      internal.map((value) => ({ value, activate: false }))
    )
  }
}
