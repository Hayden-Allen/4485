export class Behavior {
  constructor(name, scripts) {
    this.name = name
    this.scripts = scripts || []
  }
  run(entity, event, ...data) {
    this.scripts.forEach((script) => script.run(entity, event, ...data))
  }
}
