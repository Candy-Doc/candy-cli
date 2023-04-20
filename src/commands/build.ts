import { Command, Option } from 'clipanion';
import * as t from 'typanion';
import cli from '../services/cli';
import { copy } from 'fs-extra';
import { createDownloadStream } from '../tools/download';
import { getPackageLatestVersionUrl } from '../tools/npm';
import { createUnTarStream } from '../tools/archive';
import { pipeline } from 'stream/promises';
import path from 'path';

class Build extends Command {
  static paths = [[`build`], [`b`], Command.Default];

  static usage = Command.Usage({
    category: `Build`,
    description: `Build your candy-board`,
    details: `
      Build your candy-board frontend with your JSON output.
    `,
    examples: [[`Basic`, `$0 build ./maven-plugin-output.json`]],
  });

  JSONpath = Option.String({ validator: t.isString() });

  extractDir = Option.String('-e,--extract-dir', {
    validator: t.isString(),
    arity: 1,
    description: 'Where the built project should be placed',
  });

  buildName = Option.String('-b,--build-name', {
    validator: t.isString(),
    arity: 1,
    description: 'Name of the folder containing the built project',
  });

  async execute() {
    this.extractDir = this.extractDir ? this.extractDir : './';
    this.buildName = this.buildName ? this.buildName : 'candy-build';
    const finalDir = path.join(this.extractDir, this.buildName);
    try {
      await copy(this.JSONpath, `${finalDir}/candy-data.json`);
      const packageLatestVersionUrl = await getPackageLatestVersionUrl('@candy-doc/board');
      const downloadStream = createDownloadStream(packageLatestVersionUrl);
      const unTarStream = createUnTarStream(finalDir);
      await pipeline(downloadStream, unTarStream);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(error);
      }
    }
  }
}

cli.register(Build);
