jest.mock("./generate", () => jest.fn())

const cli = require("./index")
const generate = require("./generate")

describe("CLI", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("is not null", () => {
    expect(cli).toBeDefined();
  })

  it("takes 'generate' argument", () => {
    // When
    const result = cli.parse([ 'node', 'index.js', 'generate', 'input.json'])

    // Then
    expect(cli.args).toEqual(['generate', 'input.json']);
  })

  it("executes generation", () => {
    // Given
    const mockedFn = jest.fn((json) => {
      // expect(json).toBe('input.json')
    })

    // When
    const result = cli.parse([ 'node', 'index.js', 'generate', 'input.json'])

    // Then
    expect(generate).toHaveBeenCalledTimes(1);
  })
})