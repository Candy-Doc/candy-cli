import { describe } from 'mocha';
import assert from 'assert';
import path from 'path';
import * as fs from 'fs';
import { CytoscapeAdapter } from '../tools/adapter/CytoscapeAdapter';

const OUTPUTS_DIR = 'src/tests/resources/plugin_outputs';
const INPUTS_DIR = 'src/tests/resources/ui_inputs';
const ALONE_AGGREGATE = 'alone_aggregate.json';
const AGGREGATE_WITH_EDGES = 'aggregate_with_edges.json';
const AGGREGATE_WITH_ENTITY = 'aggregate_with_entity.json';
const SIMPLE_BOUNDED_CONTEXT = 'simple_bounded_context.json';
const JSON_WITH_UNKNOWN_PATTERN = 'json_with_unknown_pattern.json';
const UBIQUITOUS_LANGUAGE_WITH_WARNING = 'ubiquitous_language_with_warning.json';
const UBIQUITOUS_LANGUAGE_WITH_NOT_ALLOWED_DEPENDENCIES =
  'ubiquitous_language_with_not_allowed_dependencies.json';
const getExpectedJsonFrom = (fileName: string) => {
  const filePath = path.join(INPUTS_DIR, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const buildActualJsonForCytoscapeFrom = (fileName: string) => {
  const filePath = path.join(OUTPUTS_DIR, fileName);
  const jsonFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const adaptedJson = new CytoscapeAdapter(jsonFile).adapt();
  return JSON.parse(adaptedJson);
};

describe('Json Adapter from plugin output to candy-board input', () => {
  it('should adapts concepts', function () {
    const expectedJson = getExpectedJsonFrom(ALONE_AGGREGATE);
    const modifiedJson = buildActualJsonForCytoscapeFrom(ALONE_AGGREGATE);

    assert.deepStrictEqual(modifiedJson, expectedJson);
  });
  it('adapts concepts with edges', () => {
    const expectedJson = getExpectedJsonFrom(AGGREGATE_WITH_EDGES);
    const modifiedJson = buildActualJsonForCytoscapeFrom(AGGREGATE_WITH_EDGES);

    assert.deepStrictEqual(modifiedJson, expectedJson);
  });
  it('adapts clustered entity', () => {
    const expectedJson = getExpectedJsonFrom(AGGREGATE_WITH_ENTITY);
    const modifiedJson = buildActualJsonForCytoscapeFrom(AGGREGATE_WITH_ENTITY);

    assert.deepStrictEqual(modifiedJson, expectedJson);
  });
  it('adapts a simple bounded context', () => {
    const expectedJson = getExpectedJsonFrom(SIMPLE_BOUNDED_CONTEXT);
    const modifiedJson = buildActualJsonForCytoscapeFrom(SIMPLE_BOUNDED_CONTEXT);

    assert.deepStrictEqual(modifiedJson, expectedJson);
  });
  it('throw an error if the pattern is not known', () => {
    const jsonWithUnknownPatternPath = path.join(OUTPUTS_DIR, JSON_WITH_UNKNOWN_PATTERN);
    const jsonWithUnknownPattern = JSON.parse(fs.readFileSync(jsonWithUnknownPatternPath, 'utf-8'));
    assert.throws(
      () => {
        const modifiedJson = new CytoscapeAdapter(jsonWithUnknownPattern).adapt();
      },
      {
        name: 'Error',
        message: 'PatternFormatter : This pattern is unknown.',
      },
    );
  });
  it('adapts ubiquitous language with warnings', () => {
    const expectedJson = getExpectedJsonFrom(UBIQUITOUS_LANGUAGE_WITH_WARNING);
    const modifiedJson = buildActualJsonForCytoscapeFrom(UBIQUITOUS_LANGUAGE_WITH_WARNING);

    assert.deepStrictEqual(modifiedJson, expectedJson);
  });
  it('creates errors from not allowed dependencies', () => {
    const expectedJson = getExpectedJsonFrom(UBIQUITOUS_LANGUAGE_WITH_NOT_ALLOWED_DEPENDENCIES);
    const modifiedJson = buildActualJsonForCytoscapeFrom(
      UBIQUITOUS_LANGUAGE_WITH_NOT_ALLOWED_DEPENDENCIES,
    );

    assert.deepStrictEqual(modifiedJson, expectedJson);
  });
});
