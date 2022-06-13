import {jest} from '@jest/globals'
jest.mock("./generate.js", () => jest.fn())

import cli from './index.js'
import generate from './generate.js'

describe("CLI", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("is not null", () => {
    expect(cli).toBeDefined();
  })

  it("takes 'generate' argument", () => {
    // When
    cli.parse([ 'node', 'index.js', 'generate', 'input.json'])

    // Then
    expect(cli.args).toEqual(['generate', 'input.json']);
  })

  it("executes generation", () => {
    // When
    cli.parse([ 'node', 'index.js', 'generate', 'input.json'])

    // Then
    expect(generate).toHaveBeenCalledTimes(1);
  })
})