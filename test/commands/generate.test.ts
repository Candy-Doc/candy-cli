import {expect, test} from '@oclif/test'

describe('generate', () => {
  test
  .stdout()
  .command(['generate'])
  .it('runs generate', ctx => {
    expect(ctx.stdout).to.contain('hello candy-build')
  })

  test
  .stdout()
  .command(['generate', '--output-dir', 'output-dir'])
  .it('runs generate --output-dir output-dir', ctx => {
    expect(ctx.stdout).to.contain('hello output-dir')
  })

  test
  .stdout()
  .command(['generate', '--board-version', 'latest'])
  .it('runs generate --board-version latest', ctx => {
    expect(ctx.stdout).to.contain('hello candy-build[latest]')
  })

  test
  .stdout()
  .command(['generate', '--output-dir', 'otherDirectory', '--board-version', '1.1.0'])
  .it('runs generate --output-dir otherDirectory --board-version 1.1.0', ctx => {
    expect(ctx.stdout).to.contain('hello otherDirectory[1.1.0]')
  })
})
