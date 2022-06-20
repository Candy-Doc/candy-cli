import cli from '../src/services/cli';
import assert from 'assert';
import { deleteDir, runCli, tenSec } from './tools';

import { expect } from './expect';

describe(`Build command`, () => {
  after(async function () {
    try {
      ['candy-build', 'custom-build-name', 'custom-dir-test'].forEach((dir) => deleteDir(dir));
    } catch (err) {
      console.log(err);
    }
  });

  it(`should display help`, async () => {
    assert.deepEqual(await runCli(cli, [`build`, `-h`]), cli.usage(null));
    assert.deepEqual(await runCli(cli, [`build`, `--help`]), cli.usage(null));
  });

  it(`should exit if a JSON path is not provided`, async () => {
    await expect(runCli(cli, [`build`])).to.be.rejectedWith(Error);
  });

  it(`should exit if the given JSON doesn't exist`, async () => {
    await expect(runCli(cli, [`build`, `./invalidJSONpath.json`])).to.be.rejectedWith(Error);
  });

  it(`should exit if the given extraction directory is missing`, async () => {
    await expect(runCli(cli, [`build`, `./data.json`, `-e`])).to.be.rejectedWith(Error);
    await expect(runCli(cli, [`build`, `./data.json`, `--extract-dir`])).to.be.rejectedWith(Error);
  });

  it(`should work with a custom extraction directory`, async () => {
    await expect(
      runCli(cli, [`build`, `./data.json`, `-e`, `custom-dir-test`]),
    ).to.not.be.rejectedWith(Error);
    await expect(
      runCli(cli, [`build`, `./data.json`, `--extract-dir`, `custom-dir-test`]),
    ).to.not.be.rejectedWith(Error);
  }).timeout(tenSec);

  it(`should exit if the given build name is missing`, async () => {
    await expect(runCli(cli, [`build`, `./data.json`, `--build-name`])).to.be.rejectedWith(Error);
    await expect(runCli(cli, [`build`, `./data.json`, `-b`])).to.be.rejectedWith(Error);
  });

  it(`should work with a custom build name`, async () => {
    await expect(
      runCli(cli, [`build`, `./data.json`, `-b`, `custom-build-name`]),
    ).to.not.be.rejectedWith(Error);
    await expect(
      runCli(cli, [`build`, `./data.json`, `--build-name`, `custom-build-name`]),
    ).to.not.be.rejectedWith(Error);
  }).timeout(tenSec);

  it(`should work with a custom build name and a custom extraction directory`, async () => {
    await expect(
      runCli(cli, [`build`, `./data.json`, `-b`, `custom-build-name`, `-e`, `custom-dir-test`]),
    ).to.not.be.rejectedWith(Error);
  }).timeout(tenSec);

  it(`should exit if one param is missing`, async () => {
    await expect(
      runCli(cli, [`build`, `./data.json`, `-b`, `custom-build-name`, `-e`]),
    ).to.be.rejectedWith(Error);
  }).timeout(tenSec);

  it(`should exit if parameters are correct but the json path is missing`, async () => {
    await expect(runCli(cli, [`build`, `-b`, `custom-build-name`])).to.be.rejectedWith(Error);
  }).timeout(tenSec);

  it(`should work with a json and no parameters`, async () => {
    await expect(runCli(cli, [`build`, `./data.json`])).to.not.be.rejectedWith(Error);
  }).timeout(tenSec);
});
