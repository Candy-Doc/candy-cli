import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { Manifest } from '../model/Manifest';

const OUTPUTS_DIR_MANIFEST = 'src/tests/resources/plugin_outputs/manifests';
const OUTPUTS_DIR = 'src/tests/resources/plugin_outputs/';
const INPUTS_DIR = 'src/tests/resources/ui_inputs';
const SIMPLE_MANIFEST = 'manifest_with_one_json.json';
const TWO_BOUNDED_CONTEXTS_WITHOUT_INTERACTIONS = 'two_bounded_contexts_without_interaction.json';
const TWO_BOUNDED_CONTEXTS_WITH_INTERACTIONS = 'two_bounded_contexts_with_interaction.json';
const ALONE_AGGREGATE = 'alone_aggregate.json';

const buildActualJsonForCytoscapeFrom = (fileName: string) => {
  const filePath = path.join(OUTPUTS_DIR_MANIFEST, fileName);
  const manifestJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const manifest = new Manifest(manifestJson, OUTPUTS_DIR);
  return manifest.toCytoscape();
};
const getExpectedJsonFrom = (fileName: string) => {
  const filePath = path.join(INPUTS_DIR, fileName);
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
});
