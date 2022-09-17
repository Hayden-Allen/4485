import { System } from './System.js'

export class VaryingController extends System {
  constructor() {
    super('VaryingController')
  }
  innerUpdate(deltaTime, component) {
    const deltaTimeSeconds = deltaTime / 1000
    component.value +=
      component.step * (component.end - component.start) * deltaTimeSeconds
    if (component.value > component.end) this.clamp(component, component.end)
    if (component.value < component.start)
      this.clamp(component, component.start)
  }
  clamp(component, value) {
    if (component.reset) {
      component.value = component.start
    } else {
      component.value = value
      component.step *= -1

      if (!component.repeatCount) this.removeComponent(component)
      if (component.repeatCount != -1) component.repeatCount--
    }
  }
}
