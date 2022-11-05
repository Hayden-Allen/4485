import { Component } from '%component/Component.js'
import { scriptTemplateBank } from '%script/templates/ScriptTemplateBank.js'
import { scriptNodeTemplateBank } from '%script/ScriptNodeTemplateBank.js'
import { ScriptEdge, ScriptNodeEdgeList } from './ScriptEdge.js'

/**
 * @HATODO move these to scriptnodetemplatebank
 */
const EVENT_NODE_NAMES = new Set()
EVENT_NODE_NAMES.add('OnTick')
EVENT_NODE_NAMES.add('OnPostTick')
EVENT_NODE_NAMES.add('OnCollide')
EVENT_NODE_NAMES.add('OnSwitch')
EVENT_NODE_NAMES.add('OnRender')

class ExportNodeProxy {
  constructor(node) {
    this.node = node
    this.name = node.internalValues[0]
    this.value = node.internalValues[1]
    this.valueType = node.data.internalPorts[1].typename
    this.editorType = node.data.internalPorts[1].editorTypename
  }
  setName(name) {
    this.name = name
    this.node.internalValues[0] = name
  }
  setValue(value) {
    this.value = value
    this.node.internalValues[1] = value
  }
}

export class ScriptGraph extends Component {
  constructor(name, inputCache, pushErrorCallback, clearErrorsCallback) {
    super(name)
    this.inputCache = inputCache
    this.pushErrorCallback = pushErrorCallback || (() => {})
    this.clearErrorsCallback = clearErrorsCallback || (() => {})
    /**
     * @HATODO move this somewhere else??
     */
    this.collapsed = false
    this.firstRun = true
    this.templateName = undefined
    this.reset()
  }
  isEmpty() {
    return !this.nodes.size
  }
  reset() {
    // all nodes (map ScriptNode.id to ScriptNode)
    this.nodes = new Map()
    // only event nodes (map ScriptNode.id to ScriptNode)
    this.eventNodes = new Map()
    // nodes that have no input edges
    this.sourceNodes = []
    // nodes whose internalValues are editable via the entity properties page
    this.exportNodes = []
    // all edges (map ScriptNode.id to ScriptNodeEdgeList)
    this.edges = new Map()
    this.cachedCompile = undefined
    this.canErr = true
    this.firstRun = true
  }
  serialize() {
    // if (this.templateName) return { templateName: this.templateName }

    let nodes = []
    // ScriptNodeEdgeLists need to convert ScriptNode references to an index for serialization
    let nodeIndex = new Map()
    this.nodes.forEach((node) => {
      nodeIndex.set(node.id, nodes.length)
      nodes.push(node.serialize())
    })

    let edges = []
    this.edges.forEach((edgeList) => edges.push(edgeList.serialize(nodeIndex)))

    return {
      name: this.debugName,
      nodes,
      edges,
    }
  }
  deserialize(obj) {
    /**
     * @HATODO why is this here
     */
    // create a clone of the template
    obj = JSON.parse(JSON.stringify(obj))

    if (obj.templateName) {
      return this.deserialize(
        scriptTemplateBank.find(
          (template) => template.name === obj.templateName
        )
      )
    }

    this.reset()

    this.debugName = obj.name
    let nodeIndex = new Map()
    for (const node of obj.nodes) {
      const newNode = this.createNode(node.type, node.internalValues)
      this.nodes.set(newNode.id, newNode)
      nodeIndex.set(nodeIndex.size, newNode)
    }

    for (var i = 0; i < obj.edges.length; i++) {
      const edgeList = obj.edges[i]
      const node = nodeIndex.get(i)
      let list = this.edges.get(node.id)

      for (const edge of edgeList.in)
        list.in.push(
          new ScriptEdge(
            nodeIndex.get(edge.outputNode),
            edge.outputIndex,
            nodeIndex.get(edge.inputNode),
            edge.inputIndex
          )
        )
      for (const edge of edgeList.out)
        list.out.push(
          new ScriptEdge(
            nodeIndex.get(edge.outputNode),
            edge.outputIndex,
            nodeIndex.get(edge.inputNode),
            edge.inputIndex
          )
        )

      this.edges.set(node.id, list)
    }

    this.compile()
  }
  // for creating UI elements
  pushError(string) {
    if (this.canErr) {
      this.pushErrorCallback({
        level: 'error',
        message: string,
      })
    }
  }
  pushWarning(string) {
    if (this.canErr) {
      this.pushErrorCallback({
        level: 'warning',
        message: string,
      })
    }
  }
  // internalValues only necessary when `name` specifies an InternalScriptNodeTemplate
  createNode(name, internalValues) {
    this.templateName = undefined
    this.cachedCompile = undefined

    const node = scriptNodeTemplateBank
      .get(name)
      .createNode(this, internalValues)
    this.nodes.set(node.id, node)
    this.edges.set(node.id, new ScriptNodeEdgeList())

    return node
  }
  removeNode(node) {
    this.templateName = undefined
    this.cachedCompile = undefined

    // for each edge of this node, remove corresponding edge on connected node
    this.getEdges(node).in.forEach((edge) => {
      this.removeEdge(
        edge.outputNode,
        edge.outputIndex,
        edge.inputNode,
        edge.inputIndex
      )
    })
    this.getEdges(node).out.forEach((edge) => {
      this.removeEdge(
        edge.outputNode,
        edge.outputIndex,
        edge.inputNode,
        edge.inputIndex
      )
    })
    // remove this node and its edges directly
    this.nodes.delete(node.id)
    this.edges.delete(node.id)
  }
  addEdge(outputNode, outputIndex, inputNode, inputIndex) {
    this.templateName = undefined
    this.cachedCompile = undefined

    const edge = new ScriptEdge(outputNode, outputIndex, inputNode, inputIndex)
    this.edges.get(outputNode.id).out.push(edge)
    this.edges.get(inputNode.id).in.push(edge)
  }
  removeEdge(outputNode, outputIndex, inputNode, inputIndex) {
    this.templateName = undefined
    this.cachedCompile = undefined

    this.getEdges(outputNode).out = this.getEdges(outputNode).out.filter(
      (edge) =>
        !(
          edge.inputNode === inputNode &&
          edge.inputIndex === inputIndex &&
          edge.outputNode === outputNode &&
          edge.outputIndex === outputIndex
        )
    )
    this.getEdges(inputNode).in = this.getEdges(inputNode).in.filter(
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
    const edges = this.getEdges(node)
    return edges.in.length || edges.out.length
  }
  hasInputEdgeAt(node, inputIndex) {
    const edges = this.getEdges(node).in
    for (var i = 0; i < edges.length; i++)
      if (edges[i].inputIndex === inputIndex) return edges[i]
    return false
  }
  hasOutputEdgeAt(node, outputIndex) {
    const edges = this.getEdges(node).out
    for (var i = 0; i < edges.length; i++)
      if (edges[i].outputIndex === outputIndex) return edges[i]
    return false
  }
  forceCompile() {
    this.cachedCompile = undefined
    return this.compile()
  }
  compile() {
    if (this.cachedCompile) return this.cachedCompile
    // reset error status
    this.clearErrorsCallback(this.isEmpty())
    this.canErr = true
    // reset node groups
    this.eventNodes = new Map()
    this.sourceNodes = []
    this.exportNodes = []

    // nodes from which order-building will start (any node with no inputs)
    let buildNodes = []
    this.nodes.forEach((node) => {
      if (EVENT_NODE_NAMES.has(node.debugName)) {
        this.eventNodes.set(node.debugName, node)
        buildNodes.push(node)
      } else if (!this.getEdges(node).in.length) {
        node.isSource = true
        this.sourceNodes.push(node)
        buildNodes.push(node)
      } else {
        node.isSource = false
      }
      if (node.isExport) this.exportNodes.push(new ExportNodeProxy(node))
    })

    // determine execution order using topological sort
    let visited = new Map()
    let order = []
    buildNodes.forEach((node) => this.traverse(node, visited, order))

    this.cachedCompile = order
    return order
  }
  // dfs
  traverse(node, visited, order) {
    if (visited.has(node.id)) {
      if (visited.get(node.id) === 1) {
        this.logError('Cycle detected')
      }
      return
    }

    // status = being visited
    visited.set(node.id, 1)

    // visit children
    let outboundEdges = this.getEdges(node).out
    outboundEdges.forEach((edge) =>
      this.traverse(edge.inputNode, visited, order)
    )

    // status = fully visited
    visited.set(node.id, 2)
    // add to order
    order.unshift(node)
  }
  run(eventName, context) {
    // only runs if necessary
    this.compile()

    // check if we need to run OnSwitch
    if (this.firstRun) {
      this.firstRun = false
      this.run('OnSwitch', context)
    }

    let startNode = this.eventNodes.get(eventName)
    // this graph doesn't respond to the given event
    if (!startNode) return

    // console.log(`Run '${this.debugName}.${eventName}`)

    this.nodes.forEach((node) => (node.active = false))
    // activate given event node and set its outputs
    startNode.active = true
    startNode.outputs = context.data || []
    // activate all non-event source nodes
    // this.sourceNodes.forEach((node) => (node.active = true))

    this.cachedCompile.forEach((node) => {
      if (!node.active) return

      let inputs = []
      const edges = this.getEdges(node)
      const inboundEdges = edges.in

      // fill input array with output from parent nodes
      inboundEdges.forEach((edge) => {
        // if current edge is not an activation edge, get its data
        if (edge.inputIndex != -1)
          inputs[edge.inputIndex] = edge.outputNode.outputs[edge.outputIndex]
      })

      node.run(inputs, { ...context, inputCache: this.inputCache })
    })

    // errors generated on subsequent runs will be the same, so disable them to avoid spam
    this.canErr = false
  }
}
