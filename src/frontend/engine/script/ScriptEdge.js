import { v4 as uuidv4 } from 'uuid'

export class ScriptEdge {
  // data flows from outputNode.outputs[outputIndex] to inputNode.inputs[inputIndex]
  constructor(outputNode, outputIndex, inputNode, inputIndex) {
    this.id = uuidv4()
    this.outputNode = outputNode
    this.outputIndex = outputIndex
    this.inputNode = inputNode
    this.inputIndex = inputIndex
  }
  serialize(nodeIndex) {
    const obj = {
      outputIndex: this.outputIndex,
      inputIndex: this.inputIndex,
      outputNode: nodeIndex.get(this.outputNode.id),
      inputNode: nodeIndex.get(this.inputNode.id),
    }
    return obj
  }
}
export class ScriptNodeEdgeList {
  constructor() {
    this.in = []
    this.out = []
  }
  serialize(nodeIndex) {
    let inbound = this.in.map((edge) => edge.serialize(nodeIndex))
    let outbound = this.out.map((edge) => edge.serialize(nodeIndex))
    return { in: inbound, out: outbound }
  }
}
