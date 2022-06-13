class FileDoesntExists extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = FileDoesntExists;