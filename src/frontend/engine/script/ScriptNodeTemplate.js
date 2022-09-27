import { scriptDataType, validateScriptDataTypes } from './ScriptDataType.js'
import { ScriptNode, ScriptNodeData } from './ScriptNode.js'

export class ScriptNodeTemplate extends ScriptNodeData {
  constructor(category, name, inputPorts, outputPorts, fn, isExport) {
    super(inputPorts, [], outputPorts, fn)
    this.category = category
    this.name = name
    this.isExport = isExport
  }
  createNode(graph) {
    return new ScriptNode(
      this.category,
      this.name,
      graph,
      this.inputPorts,
      this.outputPorts,
      this.fn,
      { isExport: this.isExport }
    )
  }
}

// event script nodes only carry activation
// they are starting points for the graph
export class EventScriptNodeTemplate extends ScriptNodeTemplate {
  constructor(category, name, outputPorts) {
    super(
      category,
      name,
      [],
      outputPorts,
      (_, { node }) =>
        node.outputs.map((value) => {
          return { value, activate: true }
        }),
      false
    )
  }
}

// for nodes that contain constant values, but also have regular inputs/outputs (ie, KeyPressed)
export class InternalScriptNodeTemplate extends ScriptNodeTemplate {
  constructor(
    category,
    name,
    inputPorts,
    internalPorts,
    defaultValues,
    outputPorts,
    fn,
    isExport
  ) {
    super(category, name, inputPorts, outputPorts, fn, isExport)
    this.internalPorts = internalPorts
    this.defaultValues = defaultValues
    this.internalTypes = internalPorts.map(
      (port) => scriptDataType[port.typename]
    )
  }
  createNode(graph, internalValues) {
    // make a copy of the array for each node
    internalValues = internalValues || [...this.defaultValues]
    if (!validateScriptDataTypes(internalValues, this.internalTypes)) {
      console.error('Invalid inputs')
      return
    }

    let node = new ScriptNode(
      this.category,
      this.name,
      graph,
      this.inputPorts,
      this.outputPorts,
      this.fn,
      {
        internalPorts: this.internalPorts,
        internalValues,
        isExport: this.isExport,
      }
    )
    return node
  }
}

export class ConstantScriptNodeTemplate extends InternalScriptNodeTemplate {
  constructor(category, name, ports, defaultValues, isExport) {
    super(
      category,
      name,
      [],
      ports,
      defaultValues,
      ports,
      (_, { internal }) =>
        internal.map((value) => ({ value, activate: false })),
      isExport
    )
  }
}
