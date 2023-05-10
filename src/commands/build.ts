import { Command, Option } from 'clipanion';
import * as t from 'typanion';
import cli from '../services/cli';
import { outputFile } from 'fs-extra';
import { createDownloadStream } from '../tools/download';
import { getPackageLatestVersionUrl } from '../tools/npm';
import { createUnTarStream } from '../tools/archive';
import { pipeline } from 'stream/promises';
import path from 'path';
import fs from 'fs';
import { ManifestJson } from '../model/ManifestJson';
import { Manifest } from '../model/Manifest';

const MANIFEST_FILE_NAME = 'MANIFEST.json';

class Build extends Command {
  static paths = [[`build`], [`b`], Command.Default];

  static usage = Command.Usage({
    category: `Build`,
    description: `Build your candy-board`,
    details: `
      Build your candy-board frontend with your JSON outputs.
    `,
    examples: [[`Basic`, `$0 build ./maven-plugin-output/`]],
  });

  pluginOutputDirectory = Option.String({ validator: t.isString() });

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
    const manifestPath = path.join(this.pluginOutputDirectory, MANIFEST_FILE_NAME);
    try {
      const manifestFile: ManifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const manifest = new Manifest(manifestFile, this.pluginOutputDirectory);
      const JsonForCytoscape = manifest.toCytoscape();
      await outputFile(`${finalDir}/candy-data.json`, JsonForCytoscape);
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
