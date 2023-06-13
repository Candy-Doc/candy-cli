import { CytoscapeAdapter } from '../tools/adapter/CytoscapeAdapter';
import fs from 'fs';
import path from 'path';
import { UbiquitousLanguageJson } from './UbiquitousLanguageJson';
import { ManifestJson } from './ManifestJson';
import { IAdapter } from '../tools/adapter/Adapter';

export class Manifest {
  private outputDir: string;
  private ubiquitousLanguageJsonArray: Array<UbiquitousLanguageJson>;
  private adapter: CytoscapeAdapter;

  constructor(manifestJson: ManifestJson, outputDir: string) {
    this.outputDir = outputDir;
    this.ubiquitousLanguageJsonArray = manifestJson.files.map((filePath) =>
      this.getJsonFromPath(filePath, outputDir),
    );
    this.adapter = new CytoscapeAdapter(this.ubiquitousLanguageJsonArray);
  }

  public adapt() {
    this.adapter.adapt();
  }

  public getCytoscapeJson(): JSON {
    return JSON.parse(this.adapter.getCytoscapeJson());
  }

  public getSidebarTree(): JSON {
    return JSON.parse(this.adapter.getSidebarTree());
  }

  private getJsonFromPath(filePath: string, outputDir: string): UbiquitousLanguageJson {
    const absolutePath = path.join(outputDir, filePath);
    try {
      return JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
    } catch (e) {
      throw new Error('CytoscapeAdapter: ' + filePath + ' - No such file');
    }
  }
}
