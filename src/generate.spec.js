import generate from "./generate";
import JSONisIncorrect from "./errors/JSONisIncorrect";

describe("Generate", () => {
  it("checks if json is valid", () => {
    // Given
    const functionCalled = async () => await generate("samples/badInput.json");

    // Then
    expect(functionCalled).toThrow(JSONisIncorrect);
  })
})