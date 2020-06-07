// 函子Hello World
class MayBe {
  constructor(value) {
    const _value = Symbol()
    this[_value] = value;
  }

  static of(value) {
    return new MayBe(value)
  }

  map(fn) {
    return this.isNone() ? MayBe.of(null) : MayBe.of(fn(this._value))
  }

  isNone() {
    return this._value === null || this._value === undefined
  }
}

console.log(MayBe.of('Hello World').map((value) => value.toUpperCase()))

console.log(MayBe.of(null).map((value) => value.toUpperCase()))