const JSONisIncorrect = require("./errors/JSONisIncorrect");
const path = require("path");

const checkValidJSON = (json) => {
  const importedFile = path.resolve(json);
  try {
    return require(importedFile);
  } catch (e) {
    throw new JSONisIncorrect(`${importedFile} is incorrect: ` + e.message);
  }
}

module.exports = (json) => {
  checkValidJSON(json);
}