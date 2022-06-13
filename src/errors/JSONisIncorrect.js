class JSONisIncorrect extends Error {
  constructor(message) {
    super(message);
    this.name = "JSONisIncorrect";
  }
}

module.exports = JSONisIncorrect;