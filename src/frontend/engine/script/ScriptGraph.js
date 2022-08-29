import { Component } from '%component/Component.js'

class ScriptGraphEdge {
  // data flows from outputNode.outputs[outputIndex] to inputNode.inputs[inputIndex]
  constructor(outputNode, outputIndex, inputNode, inputIndex) {
    this.outputNode = outputNode
    this.outputIndex = outputIndex
    this.inputNode = inputNode
    this.inputIndex = inputIndex
  }
}
class ScriptNodeEdgeList {
  constructor() {
    this.in = []
    this.out = []
  }
}
export class ScriptGraph extends Component {
  constructor(debugName) {
    super(debugName)
    // map ScriptNode.id to ScriptNode
    this.nodes = new Map()
    // map ScriptNode.id to ScriptNodeEdgeList
    this.edges = new Map()
    // nodes with no inputs
    this.startNodes = []
    this.cachedCompile = undefined
  }
  addNode(node) {
    if (this.nodes.has(node.id)) {
      this.logError(`${node.logMessageName()} already exists`)
      return
    }
    // graph has changed, need to recompile
    this.cachedCompile = undefined
    this.nodes.set(node.id, node)
  }
  addEdge(outputNode, outputIndex, inputNode, inputIndex) {
    if (
      !outputNode.checkOutputIndex(outputIndex) ||
      !inputNode.checkInputIndex(inputIndex)
    ) {
      this.logError(`Invalid input/output index`)
      return
    }

    this.cachedCompile = undefined

    if (!this.edges.has(inputNode.id))
      this.edges.set(inputNode.id, new ScriptNodeEdgeList())
    if (!this.edges.has(outputNode.id))
      this.edges.set(outputNode.id, new ScriptNodeEdgeList())

    const edge = new ScriptGraphEdge(
      outputNode,
      outputIndex,
      inputNode,
      inputIndex
    )
    this.edges.get(outputNode.id).out.push(edge)
    this.edges.get(inputNode.id).in.push(edge)
  }
  removeEdge(outputNode, outputIndex, inputNode, inputIndex) {
    this.getEdges(inputNode).in = this.getEdges(inputNode).in.filter(
      (edge) =>
        !(edge.outputIndex === outputIndex && edge.inputIndex === inputIndex)
    )
    this.getEdges(outputNode).out = this.getEdges(outputNode).out.filter(
      (edge) =>
        !(edge.outputIndex === outputIndex && edge.inputIndex === inputIndex)
    )
  }
  getEdges(node) {
    return this.edges.get(node.id)
  }
  compile() {
    // identify nodes to start from
    this.startNodes = []
    this.nodes.forEach((node) => {
      if (!this.edges.has(node.id))
        this.logWarning(`Disconnected ${node.logMessageName()}`)
      else if (this.edges.get(node.id).in.length === 0)
        this.startNodes.push(node)
    })

    let visited = new Map()
    // a valid order to traverse this DAG, as identified by a topological sort
    let order = []
    this.startNodes.forEach((node) => this.dfs(node, visited, order))

    return order
  }
  dfs(node, visited, order) {
    if (visited.has(node.id)) {
      // this node has been visited, but not fully; found a cycle
      if (visited.get(node.id) == 1) {
        this.logError(`${node.logMessageName()} causes a cycle`)
        return
      }
      // node has been fully visited
      return
    }

    // being visited
    visited.set(node.id, 1)

    // visit children
    let outboundEdges = this.edges.get(node.id).out
    outboundEdges.forEach((edge) => this.dfs(edge.inputNode, visited, order))

    // finished being visited
    visited.set(node.id, 2)
    // add to topological sort results
    order.unshift(node)
  }
  run(entity) {
    // graph has changed, need to recompile
    if (!this.cachedCompile) this.cachedCompile = this.compile()

    // reset activation for all nodes
    this.nodes.forEach((node) => (node.active = false))
    // always run start nodes
    this.startNodes.forEach((node) => (node.active = true))

    let outputs = new Map()

    this.cachedCompile.forEach((node) => {
      if (!node.active) return
      // build input array
      let inputs = []
      let edges = this.edges.get(node.id)
      let inputEdges = edges.in

      // fill input array with cached output from previous nodes (guaranteed to be valid because of topological ordering)
      if (inputEdges.length) {
        inputEdges.forEach((edge) => {
          if (edge.inputIndex != -1)
            inputs[edge.inputIndex] = edge.outputNode.outputs[edge.outputIndex]
        })
      }
      // run current node with appropriate inputs; this also propagates activation to connected nodes
      node.run(inputs, entity)

      // this is a terminating node, return its output
      if (!edges.out.length) outputs.set(node.id, node.outputs)
    })
    return outputs
  }
}
