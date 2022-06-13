class JSONisIncorrect extends Error {
  constructor(message) {
    super(message);
    this.name = "JSONisIncorrect";
  }
}

export default JSONisIncorrect;