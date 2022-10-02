export class Behavior {
  constructor(scripts) {
    this.scripts = scripts || []
    /**
     * @HATODO move this ??
     */
    this.collapsed = false
  }
  run(entity, event, ...data) {
    this.scripts.forEach((script) => script.run(entity, event, ...data))
  }
}
