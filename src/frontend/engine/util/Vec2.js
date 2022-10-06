import { global } from '%engine/Global.js'

export class Vec2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  equals(other) {
    return (
      Math.abs(this.x - other.x) <= global.epsilon &&
      Math.abs(this.y - other.y) <= global.epsilon
    )
  }
  plus(other) {
    return new Vec2(this.x + other.x, this.y + other.y)
  }
  minus(other) {
    return new Vec2(this.x - other.x, this.y - other.y)
  }
  scale(s) {
    return new Vec2(this.x * s, this.y * s)
  }
  plusEqual(other) {
    this.x += other.x
    this.y += other.y
  }
  minusEqual(other) {
    this.x -= other.x
    this.y -= other.y
  }
  scaleEqual(s) {
    this.x *= s
    this.y *= s
  }
  negative() {
    return new Vec2(-this.x, -this.y)
  }
  perpendicular() {
    return new Vec2(-this.y, this.x)
  }
  lengthSquared() {
    return this.x * this.x + this.y * this.y
  }
  magnitude() {
    return Math.sqrt(this.lengthSquared())
  }
  norm() {
    const magnitude = this.magnitude()
    if (magnitude == 0) return new Vec2(0, 0)
    return this.scale(1 / magnitude)
  }
  normalize() {
    this.scaleEqual(1 / this.magnitude())
    return this
  }
  dot(other) {
    return this.x * other.x + this.y * other.y
  }
}
