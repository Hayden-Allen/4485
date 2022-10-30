import produce from 'immer'
import { ref } from 'valtio'

import { ScriptGraph } from '%script/ScriptGraph.js'

class ScriptExportWrapper {
  constructor({ scriptGraphNode, reactFlowNode }) {
    this.name = scriptGraphNode.internalValues[0]
    this.value = scriptGraphNode.internalValues[1]
    this.valueType = scriptGraphNode.data.internalPorts[1].typename
    this.editorType = scriptGraphNode.data.internalPorts[1].editorTypename
    this._scriptGraphNode = ref(scriptGraphNode)
    this._reactFlowNode = ref(reactFlowNode)
  }

  setValue(value) {
    this.value = value
    this._scriptGraphNode.internalValues[1] = this.value
    this._reactFlowNode.data.value = this.value
  }
}

export default class ScriptWrapper {
  constructor({ gameWindow, name, reactFlowState }) {
    this._gameWindow = gameWindow
    this.name = name || 'Untitled Script'
    this.setFromReactFlow(reactFlowState)
  }

  setFromReactFlow(reactFlowState) {
    const graph = new ScriptGraph(this.name, this._gameWindow.inputCache)

    const { nodes, edges } = reactFlowState
    let nodeIndex = new Map()
    nodes.forEach((reactFlowNode) => {
      const engineNode = graph.createNode(reactFlowNode.data.name, [
        reactFlowNode.data.name,
        reactFlowNode.data.value,
      ])
      nodeIndex.set(reactFlowNode.id, engineNode)
    })
    edges.forEach((edge) => {
      graph.addEdge(
        nodeIndex.get(edge.source),
        parseInt(edge.data.sourcePort.substring(1)),
        nodeIndex.get(edge.target),
        parseInt(edge.data.targetPort.substring(1))
      )
    })

    this._graph = ref(graph)
    this.reactFlow = { ...reactFlowState }
    this.exports = []
    nodes.forEach((reactFlowNode) => {
      const scriptGraphNode = nodeIndex(reactFlowNode.id)
      if (scriptGraphNode.isExport) {
        this.exports.push(
          new ScriptExportWrapper({ scriptGraphNode, reactFlowNode })
        )
      }
    })
  }
}
