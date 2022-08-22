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

export class ConstantScriptNodeTemplate {
  constructor(name, outPorts) {
    this.name = name
    this.outputTypes = outPorts.map((port) => scriptDataType[port.typename])
  }
  createNode(graph, outputValues) {
    // console.log(outputValues)
    // console.log(this.outputTypes)
    if (!validateScriptDataTypes(outputValues, this.outputTypes)) {
      console.error('Invalid inputs')
      return
    }

    let outputs = []
    outputValues.forEach((value) => outputs.push({ value, activate: false }))
    // a constant node should not carry activation; it is merely a data supplier
    let node = new ScriptNode(
      this.name,
      graph,
      new ScriptDataTypeList([]),
      this.outputTypes,
      () => {
        return outputs
      }
    )
    // this node will always return the given values
    node.outputs = outputValues
    return node
  }
}
