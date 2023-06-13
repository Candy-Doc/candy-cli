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
    console.log('*** EXECUTING CANDY-DOC BUILD ***');
    this.extractDir = this.extractDir ? this.extractDir : './';
    this.buildName = this.buildName ? this.buildName : 'candy-build';
    const finalDir = path.join(this.extractDir, this.buildName);
    const manifestPath = path.join(this.pluginOutputDirectory, MANIFEST_FILE_NAME);
    try {
      console.log('candy-doc : Retrieving the manifest ...');
      const manifestFile: ManifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      console.log('candy-doc : Retrieval OK');
      console.log('candy-doc : Parsing the manifest ...');
      const manifest = new Manifest(manifestFile, this.pluginOutputDirectory);
      console.log('candy-doc : Parsing OK');
      console.log('candy-doc : Adapting the output ...');
      manifest.adapt();
      console.log('candy-doc : Adapting OK');
      console.log('candy-doc : Writing the new cytoscape input ...');
      await outputFile(`${finalDir}/candy-data.json`, JSON.stringify(manifest.getCytoscapeJson()));
      console.log('candy-doc : Writing OK');
      console.log('candy-doc : Collecting sidebar information ...');
      await outputFile(`${finalDir}/sidebar-tree.json`, JSON.stringify(manifest.getSidebarTree()));
      console.log('candy-doc : Collecting OK');
      console.log('candy-doc : Downloading candy-build ...');
      const packageLatestVersionUrl = await getPackageLatestVersionUrl('@candy-doc/board');
      const downloadStream = createDownloadStream(packageLatestVersionUrl);
      const unTarStream = createUnTarStream(finalDir);
      await pipeline(downloadStream, unTarStream);
      console.log('candy-doc : Downloading OK');
      console.log('*** DONE ***');
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
