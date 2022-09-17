import { validateScriptDataTypes } from './ScriptDataType.js'
import { ScriptNodeData } from './ScriptNodeData.js'
import { Component } from '%component/Component.js'
import { ScriptDataTypeList } from './ScriptDataType.js'

export class ScriptNodePort {
  constructor(name, typename, editorTypename) {
    this.name = name
    this.typename = typename
    this.editorTypename = editorTypename || typename
  }
}

export class ScriptNode extends Component {
  constructor(
    type,
    debugName,
    graph,
    inputPorts,
    outputPorts,
    fn,
    { internalPorts = [], internalValues = [] } = {}
  ) {
    super(debugName)
    /**
     * @HATODO this shouldn't be here, only needed in proxy
     */
    this.type = type
    this.graph = graph
    this.graph.addNode(this)
    this.data = new ScriptNodeData(inputPorts, internalPorts, outputPorts, fn)
    this.inputTypes = new ScriptDataTypeList(
      inputPorts.map((port) => port.typename)
    )
    this.outputTypes = new ScriptDataTypeList(
      outputPorts.map((port) => port.typename)
    )
    // cached outputs from last run
    this.outputs = []
    // whether or not this node should be evaluated during current graph execution
    this.active = false
    // internal constants
    this.internalValues = internalValues
  }
  checkIndex(types, index) {
    // -1 signals that an edge carries activation, but not value
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
  // outputNode.outputs[outputIndex] => this.inputs[inputIndex]
  attachAsInput(outputNode, outputIndex, inputIndex) {
    if (!this.graph.isSameComponent(outputNode.graph)) {
      this.logError(`Cannot attach two ScriptNodes from different Graphs`)
      return
    }
    // remove existing edge first
    const existing = this.graph.hasInputEdge(this, inputIndex)
    if (existing)
      this.graph.removeEdge(
        existing.outputNode,
        existing.outputIndex,
        this,
        inputIndex
      )
    this.graph.addEdge(outputNode, outputIndex, this, inputIndex)
  }
  // this.outputs[outputIndex] => inputNode.inputs[inputIndex]
  attachAsOutput(outputIndex, inputNode, inputIndex) {
    if (!this.graph.isSameComponent(inputNode.graph)) {
      this.logError(`Cannot attach two ScriptNodes from different Graphs`)
      return
    }
    // remove existing edge first
    const existing = this.graph.hasInputEdge(inputNode, inputIndex)
    if (existing)
      this.graph.removeEdge(
        existing.outputNode,
        existing.outputIndex,
        inputNode,
        inputIndex
      )
    this.graph.addEdge(this, outputIndex, inputNode, inputIndex)
  }
  run(inputs, entity, inputCache) {
    if (!this.active) return

    // console.log(inputs)
    // console.log(this.data.inputTypes.types)
    if (!validateScriptDataTypes(inputs, this.inputTypes.types)) {
      this.graph.pushError(`Invalid input to '${this.debugName}'`)
      return
    }

    const results =
      this.data.fn(inputs, {
        entity,
        internal: this.internalValues,
        input: inputCache,
      }) || []
    this.outputs = results.map((result) => result.value)
    // propagate activation
    let outboundEdges = this.graph.edges.get(this.id).out
    // eslint-disable-next-line no-redeclare
    for (var i = 0; i < outboundEdges.length; i++) {
      // get an outbound edge and the output associated with that edge
      const edge = outboundEdges[i]
      if (edge.outputIndex === -1) {
        // this is an activation edge
        edge.inputNode.active = true
      } else {
        const result = results[edge.outputIndex]
        // if the associated output is explicitly active OR not set, activate the edge's other node
        if (result.activate || result.activate === undefined)
          edge.inputNode.active = true
      }
    }
  }
}
