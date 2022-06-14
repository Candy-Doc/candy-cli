import generate from "./generate";
import JSONisIncorrect from "./errors/JSONisIncorrect";

describe("Generate",  () => {
  it("checks if json is valid", async () => {
    // Given
    const functionCalled = generate("samples/badInput.json")
    
    // Then
    await expect(functionCalled)
    .rejects
    .toThrow(JSONisIncorrect);
  })
})