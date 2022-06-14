import {expect, test} from '@oclif/test'

describe('generate', () => {
  // Todo: test if json arg is here or not

  test
  .stdout()
  .command(['generate', 'valid-data.json'])
  .it('runs generate valid-data.json', ctx => {
    expect(ctx.stdout).to.contain('candy-build')
  })

  test
  .stdout()
  .command(['generate', 'valid-data.json', '--output-dir', 'output-dir'])
  .it('runs generate valid-data.json --output-dir output-dir', ctx => {
    expect(ctx.stdout).to.contain('output-dir')
  })

  test
  .stdout()
  .command(['generate', 'valid-data.json', '--board-version', 'latest'])
  .it('runs generate valid-data.json --board-version latest', ctx => {
    expect(ctx.stdout).to.contain('candy-build[latest]')
  })

  test
  .stdout()
  .command(['generate', 'valid-data.json', '--output-dir', 'otherDirectory', '--board-version', '1.1.0'])
  .it('runs generate valid-data.json --output-dir otherDirectory --board-version 1.1.0', ctx => {
    expect(ctx.stdout).to.contain('otherDirectory[1.1.0]')
  })
})
