const setting = {
  verbosityNone: 0,
  verbosityError: 1,
  verbosityWarning: 2,
  verbosityInfo: 3,
  verbosity: 3,
  showId: false,
  stackTrace: true,
}

export class Loggable {
  constructor() {
    if (this.constructor.name === 'Object' || this.constructor === Loggable)
      console.error('Loggable is an abstract class')
  }
  logMessageName() {}
  logMessageNameNoId() {}
  getLogName() {
    return setting.showId ? this.logMessageName() : this.logMessageNameNoId()
  }
  logMessageFormat(message) {
    return `${this.getLogName()}: ${message}`
  }
  logInfo(message) {
    if (setting.verbosity >= setting.verbosityInfo)
      console.log(this.logMessageFormat(message))
  }
  logWarning(message) {
    if (setting.verbosity >= setting.verbosityWarning)
      console.warn(this.logMessageFormat(message))
    if (setting.stackTrace) console.trace()
  }
  logError(message) {
    if (setting.verbosity >= setting.verbosityError)
      console.error(this.logMessageFormat(message))
    if (setting.stackTrace) console.trace()
  }
}
