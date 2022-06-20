import cli from '../src/services/cli';
import assert from 'assert';
import { runCli } from './tools';
import './../src/commands';
import { version } from '../package.json';

describe(`CLI`, () => {
  it(`should display help`, async () => {
    assert.deepEqual(await runCli(cli, [`-h`]), cli.usage(null));
    assert.deepEqual(await runCli(cli, [`--help`]), cli.usage(null));
  });

  it(`should display the version of the binary`, async () => {
    assert.equal(await runCli(cli, [`-v`]), `${version}\n`);
    assert.equal(await runCli(cli, [`--version`]), `${version}\n`);
  });
});
