export class State {
  constructor(name, scripts) {
    this.name = name
    this.scripts = scripts || []
    /**
     * @HATODO move this ??
     */
    this.collapsed = false
  }
  run(event, context, ...data) {
    this.scripts.forEach((script) => script.run(event, context, ...data))
  }
  reset() {
    this.scripts.forEach((script) => (script.firstRun = true))
  }
}
