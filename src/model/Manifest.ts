import { CytoscapeAdapter } from '../tools/adapter/CytoscapeAdapter';
import fs from 'fs';
import path from 'path';
import { UbiquitousLanguageJson } from './UbiquitousLanguageJson';
import { ManifestJson } from './ManifestJson';

export class Manifest {
  private outputDir: string;
  private ubiquitousLanguageJsonArray: Array<UbiquitousLanguageJson>;

  constructor(manifestJson: ManifestJson, outputDir: string) {
    this.outputDir = outputDir;
    this.ubiquitousLanguageJsonArray = manifestJson.files.map((filePath) =>
      this.getJsonFromPath(filePath, outputDir),
    );
  }

  public toCytoscape(): JSON {
    const adaptedJson = new CytoscapeAdapter(this.ubiquitousLanguageJsonArray).adapt();
    return JSON.parse(adaptedJson);
  }

  private getJsonFromPath(filePath: string, outputDir: string): UbiquitousLanguageJson {
    const absolutePath = path.join(outputDir, filePath);
    return JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
  }
}