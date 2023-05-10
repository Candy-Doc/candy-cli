import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { Manifest } from '../model/Manifest';
import { ManifestJson } from '../model/ManifestJson';

const OUTPUTS_DIR_MANIFEST = 'src/tests/resources/plugin_outputs/manifests';
const INPUTS_DIR = 'src/tests/resources/ui_inputs';
const SIMPLE_MANIFEST = 'manifest_with_one_json';
const TWO_BOUNDED_CONTEXTS_WITHOUT_INTERACTIONS = 'two_bounded_contexts_without_interaction';
const TWO_BOUNDED_CONTEXTS_WITH_INTERACTIONS = 'two_bounded_contexts_with_interaction';
const NO_SUCH_FILE = 'no_such_file';
const ALONE_AGGREGATE = 'alone_aggregate';

const buildActualJsonForCytoscapeFrom = (dirName: string) => {
  const filePath = path.join(OUTPUTS_DIR_MANIFEST, dirName + '/MANIFEST.json');
  const manifestJson: ManifestJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const manifest = new Manifest(manifestJson, path.join(OUTPUTS_DIR_MANIFEST, dirName));
  return manifest.toCytoscape();
};
const getExpectedJsonFrom = (fileName: string) => {
  const filePath = path.join(INPUTS_DIR, fileName + '.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};
describe('Creation of an unique file from all json files classified in the manifest', () => {
  it('gets a single json in a manifest', () => {
    const actualJson = buildActualJsonForCytoscapeFrom(SIMPLE_MANIFEST);
    const expectedJson = getExpectedJsonFrom(ALONE_AGGREGATE);

    assert.deepStrictEqual(actualJson, expectedJson);
  });
  it('merges two simple bounded context with interaction', () => {
    const actualJson = buildActualJsonForCytoscapeFrom(TWO_BOUNDED_CONTEXTS_WITH_INTERACTIONS);
    const expectedJson = getExpectedJsonFrom(TWO_BOUNDED_CONTEXTS_WITH_INTERACTIONS);

    assert.deepStrictEqual(actualJson, expectedJson);
  });
  it('merges two simple bounded context without interaction', () => {
    const actualJson = buildActualJsonForCytoscapeFrom(TWO_BOUNDED_CONTEXTS_WITHOUT_INTERACTIONS);
    const expectedJson = getExpectedJsonFrom(TWO_BOUNDED_CONTEXTS_WITHOUT_INTERACTIONS);

    assert.deepStrictEqual(actualJson, expectedJson);
  });
  it('throws an error a json file is not in the same directory as the manifest', () => {
    assert.throws(
      () => {
        buildActualJsonForCytoscapeFrom(NO_SUCH_FILE);
      },
      {
        name: 'Error',
        message: 'CytoscapeAdapter: /fake_file.json - No such file',
      },
    );
  });
});
