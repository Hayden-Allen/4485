export const scriptDataType = {
  int: 0x1,
  float: 0x2,
  array: 0x4,
  object: 0x8,
}
export function resolveScriptDataType(input) {
  switch (typeof input) {
    // no way to determine which it should be; it can be both. So set both flags
    case 'number':
      return (
        (Number.isInteger(input) ? scriptDataType.int : 0) |
        scriptDataType.float
      )
    case 'object':
      return Array.isArray(input) ? scriptDataType.array : scriptDataType.object
  }
}
export function validateScriptDataTypes(input, expected) {
  if (input.length != expected.length) return false
  for (var i = 0; i < expected.length; i++) {
    if (!(resolveScriptDataType(input[i]) & expected[i])) {
      return false
    }
  }
  return true
}
export class ScriptDataTypeList {
  constructor(typenames) {
    this.types = typenames.map((name) => {
      if (name === 'number') return scriptDataType.int | scriptDataType.float
      return scriptDataType[name]
    })
    this.length = this.types.length
  }
}
