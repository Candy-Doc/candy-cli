import {expect, test} from '@oclif/test'

describe('CLI', () => {
  test
  .command(['generate'])
  .catch(error => {
    expect(error.name).to.equal('JSONNotFound')
    expect(error.message).to.contain('doesn\'t exists. Please enter valid JSON file path.')
  })
  .it('throws a error when json is not found')

  test
  .stdout()
  .command(['generate', 'valid-data.json'])
  .it('runs generate valid-data.json', ctx => {
    expect(ctx.stdout).to.contain('Candy-CLI')
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
    expect(ctx.stdout).to.contain('[latest]')
  })

  test
  .stdout()
  .command(['generate', 'valid-data.json', '--output-dir', 'output-dir', '--board-version', '1.1.0'])
  .it('runs generate valid-data.json --output-dir output-dir --board-version 1.1.0', ctx => {
    expect(ctx.stdout).to.contain('output-dir')
    expect(ctx.stdout).to.contain('[1.1.0]')
  })
})
