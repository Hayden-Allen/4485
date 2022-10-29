import produce from 'immer'
import { ref } from 'valtio'

import { ScriptGraph } from '%script/ScriptGraph.js'

class ScriptExportWrapper {
  constructor(node) {
    this.name = node.internalValues[0]
    this.value = node.internalValues[1]
    this.valueType = node.data.internalPorts[1].typename
    this.editorType = node.data.internalPorts[1].editorTypename
    this._node = ref(node)
  }

  setValue(value) {
    this.value = value
    this._node.internalValues[1] = this.value
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
    // TODO: Setup the graph from the React Flow nodes/edges...
    //

    this._graph = ref(graph)
    this.reactFlow = { ...reactFlowState }
    this.exports = []
    this._graph.nodes.forEach((node) => {
      if (node.isExport) {
        this.exports.push(new ScriptExportWrapper(node))
      }
    })
  }
}
