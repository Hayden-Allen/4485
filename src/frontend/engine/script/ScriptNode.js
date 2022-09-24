import { validateScriptDataTypes } from './ScriptDataType.js'
import { Component } from '%component/Component.js'
import { ScriptDataTypeList } from './ScriptDataType.js'

export class ScriptNodePort {
  constructor(name, typename, editorTypename) {
    this.name = name
    this.typename = typename
    this.editorTypename = editorTypename || typename
  }
}
export class ScriptNodeData {
  constructor(inputPorts, internalPorts, outputPorts, fn) {
    this.inputPorts = inputPorts
    this.internalPorts = internalPorts
    this.outputPorts = outputPorts
    this.fn = fn
  }
}

export class ScriptNode extends Component {
  constructor(
    category,
    templateName,
    graph,
    inputPorts,
    outputPorts,
    fn,
    { internalPorts = [], internalValues = [], isExport = false } = {}
  ) {
    super(templateName)
    /**
     * @HATODO only needed in proxy
     */
    this.category = category

    this.graph = graph
    this.data = new ScriptNodeData(inputPorts, internalPorts, outputPorts, fn)
    this.inputTypes = new ScriptDataTypeList(
      inputPorts.map((port) => port.typename)
    )
    this.outputs = []
    this.active = false
    this.internalValues = internalValues
    this.isExport = isExport
  }
  serialize() {
    const obj = {
      type: this.debugName,
      internalValues: this.internalValues,
    }
    return obj
  }
  checkIndex(types, index) {
    // -1 is an activation edge
    if (index < -1 || index > types.length) {
      this.logError(`Invalid index ${index}`)
      return false
    }
    return true
  }
  checkInputIndex(index) {
    return this.checkIndex(this.inputTypes, index)
  }
  checkOutputIndex(index) {
    return this.checkIndex(this.outputTypes, index)
  }
  attachBase(inputNode, inputIndex) {
    const existing = this.graph.hasInputEdgeAt(inputNode, inputIndex)
    if (existing)
      this.graph.removeEdge(
        existing.outputNode,
        existing.outputIndex,
        existing.inputNode,
        existing.inputIndex
      )
  }
  attachAsInput(outputNode, outputIndex, inputIndex) {
    this.attachBase(this, inputIndex)
    this.graph.addEdge(outputNode, outputIndex, this, inputIndex)
  }
  attachAsOutput(outputIndex, inputNode, inputIndex) {
    this.attachBase(inputNode, inputIndex)
    this.graph.addEdge(this, outputIndex, inputNode, inputIndex)
  }
  run(inputs, entity, inputCache) {
    if (!validateScriptDataTypes(inputs, this.inputTypes.types)) {
      this.graph.pushError(`Invalid input to '${this.debugName}'`)
      return
    }

    const results =
      this.data.fn(inputs, {
        entity,
        internal: this.internalValues,
        input: inputCache,
        node: this,
      }) || []

    // store output values
    // each entry in results also has activation info
    this.outputs = results.map((result) => result.value)
    // propagate activation
    const outboundEdges = this.graph.getEdges(this).out
    for (var i = 0; i < outboundEdges.length; i++) {
      const edge = outboundEdges[i]
      // `edge` is an activation edge
      if (edge.outputIndex === -1) {
        edge.inputNode.active = true
      } else {
        const { activate } = results[edge.outputIndex]
        // a value of true means explicitly activate all child nodes
        // no value (undefined) means activate all child nodes ONLY if this node runs (which it just did)
        if (activate || activate === undefined) {
          edge.inputNode.active = true
        }
      }
    }
  }
}
