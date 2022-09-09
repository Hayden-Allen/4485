import { Component } from '%component/Component.js'
import { ScriptNodeTemplateBank } from '%script/ScriptNodeTemplateBank.js'

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
  constructor(debugName, inputCache, pushError, clearErrors) {
    super(debugName)
    this.inputCache = inputCache
    this.templateBank = new ScriptNodeTemplateBank()
    // map ScriptNode.id to ScriptNode
    this.nodes = new Map()
    // map ScriptNode.id to ScriptNodeEdgeList
    this.edges = new Map()
    // nodes with no inputs
    this.startNodes = []
    this.cachedCompile = undefined
    this._pushError = pushError
    this.clearErrors = clearErrors
    this.canErr = true
  }
  createNode(name, values) {
    return this.templateBank.get(name).createNode(this, values)
  }
  pushError(string) {
    if (this.canErr) {
      this._pushError({
        level: 'error',
        message: string,
      })
    }
  }
  pushWarning(string) {
    if (this.canErr) {
      this._pushError({
        level: 'warning',
        message: string,
      })
    }
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
  /**
   * @HATODO cleanup
   */
  removeEdge(outputNode, outputIndex, inputNode, inputIndex) {
    let outputEdges = this.getEdges(outputNode).out
    let inputEdges = this.getEdges(inputNode).in
    this.getEdges(outputNode).out = outputEdges.filter(
      (edge) =>
        !(
          edge.inputNode === inputNode &&
          edge.inputIndex === inputIndex &&
          edge.outputNode === outputNode &&
          edge.outputIndex === outputIndex
        )
    )
    this.getEdges(inputNode).in = inputEdges.filter(
      (edge) =>
        !(
          edge.inputNode === inputNode &&
          edge.inputIndex === inputIndex &&
          edge.outputNode === outputNode &&
          edge.outputIndex === outputIndex
        )
    )
  }
  getEdges(node) {
    return this.edges.get(node.id)
  }
  hasEdges(node) {
    if (!this.edges.has(node.id)) return false
    const edges = this.edges.get(node.id)
    return edges.in.length || edges.out.length
  }
  hasInputEdge(node, inputIndex) {
    if (!this.hasEdges(node)) return false
    return this.getEdges(node).in.filter(
      (edge) => edge.inputIndex === inputIndex
    )[0]
  }
  compile() {
    this.clearErrors()
    this.canErr = true
    /**
     * @HATODO this is where all event nodes will be detected
     */
    // nodes that execution will start from (event nodes)
    this.startNodes = []
    // nodes that order-building will start from (any node with no input edges)
    let sourceNodes = []
    this.nodes.forEach((node) => {
      if (node.debugName === 'OnTick') {
        this.startNodes.push(node)
        sourceNodes.push(node)
      } else if (!this.getEdges(node).in.length) {
        sourceNodes.push(node)
      }
    })

    let visited = new Map()
    // a valid order to traverse this DAG, as identified by a topological sort
    let order = []
    sourceNodes.forEach((node) => this.dfs(node, visited, order))

    return order
  }
  dfs(node, visited, order) {
    if (visited.has(node.id)) return

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
    /**
     * @HATODO maybe this shouldn't be the case?
     */
    // always run nodes with no inputs
    this.nodes.forEach((node) => {
      if (!this.getEdges(node).in.length) node.active = true
    })

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
      node.run(inputs, entity, this.inputCache)

      // this is a terminating node, return its output
      if (!edges.out.length) outputs.set(node.id, node.outputs)
    })

    this.canErr = false
    return outputs
  }
}
