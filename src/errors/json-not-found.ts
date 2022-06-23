export default class JSONNotFound extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'JSONNotFound'
    Object.setPrototypeOf(this, JSONNotFound.prototype)
  }
}
