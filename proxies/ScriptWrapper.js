import { ScriptGraph } from '%script/ScriptGraph.js'

export default class ScriptWrapper {
  constructor() {
    this.graph = null
    this.nodes = []
    this.edges = []
    this.exports = []
  }
}
