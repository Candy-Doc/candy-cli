const generate = require("./generate");
const JSONisIncorrect = require("./errors/JSONisIncorrect");

describe("Generate", () => {
  it("checks if json is valid", () => {
    // Given
    const functionCalled = () => generate("samples/badInput.json");

    // Then
    expect(functionCalled).toThrow(JSONisIncorrect);
  })
})