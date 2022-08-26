export class ScriptNodeData {
  constructor(inputPorts, internalPorts, outputPorts, fn) {
    this.inputPorts = inputPorts
    this.internalPorts = internalPorts
    this.outputPorts = outputPorts
    this.fn = fn
  }
}
