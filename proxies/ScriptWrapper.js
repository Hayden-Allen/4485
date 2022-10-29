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
    // FIXME: The correct property of reactFlowNode may be called something else
    // Additionally, maybe we need to use immer to update the internal values, or maybe reactFlowNode should not be a ref? Just ideas in case it doesn't work at first...
    this._reactFlowNode.internalValues[1] = this.value
  }
}

export default class ScriptWrapper {
  constructor({ name, reactFlowState }) {
    this.name = name || 'Untitled Script'
    this.setFromReactFlow(reactFlowState)
  }

  setFromReactFlow(reactFlowState) {
    const graph = new ScriptGraph()

    //
    // FIXME: Setup the graph from the React Flow nodes/edges...
    //

    this._graph = ref(graph)
    this.reactFlow = { ...reactFlowState }
    this.exports = []
    this._graph.nodes.forEach((node) => {
      if (node.isExport) {
        const reactFlowNode = null
        for (const rfn of reactFlowState.nodes) {
          // FIXME: Make sure we're comparing the correct IDs (by default React Flow IDs are different than engine UUIDs so we need to map one to the other ??
          if (rfn.id === node.id) {
            reactFlowNode = rfn
            break
          }
        }
        this.exports.push(
          new ScriptExportWrapper({ scriptGraphNode: node, reactFlowNode })
        )
      }
    })
  }
}
