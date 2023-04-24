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
function sortJson(json: string): string {
  const jsonObject = JSON.parse(json);
  return JSON.stringify(jsonObject.elements.sort());
}
function sortParsedJson(json: any): string {
  return JSON.stringify(json.elements.sort());
}

describe('Json Adapter from plugin output to candy-board input', () => {
  it('should transform concepts', function () {
    const outputAloneAggregatePath = path.join(OUTPUTS_DIR, ALONE_AGGREGATE);
    const inputAloneAggregatePath = path.join(INPUTS_DIR, ALONE_AGGREGATE);

    const aloneAggregateJson = JSON.parse(fs.readFileSync(outputAloneAggregatePath, 'utf-8'));
    const expectedJson = JSON.parse(fs.readFileSync(inputAloneAggregatePath, 'utf-8'));

    const modifiedJson = new CytoscapeAdapter(aloneAggregateJson).adapt();

    assert.deepStrictEqual(sortJson(modifiedJson), sortParsedJson(expectedJson));
  });
  it('transforms concepts with edges', () => {
    const outAggregateWithEdgesPath = path.join(OUTPUTS_DIR, AGGREGATE_WITH_EDGES);
    const inAggregateWithEdgesPath = path.join(INPUTS_DIR, AGGREGATE_WITH_EDGES);

    const aggregateWithEdgesJson = JSON.parse(fs.readFileSync(outAggregateWithEdgesPath, 'utf-8'));
    const expectedJson = JSON.parse(fs.readFileSync(inAggregateWithEdgesPath, 'utf-8'));

    const modifiedJson = new CytoscapeAdapter(aggregateWithEdgesJson).adapt();

    assert.deepStrictEqual(JSON.parse(modifiedJson), expectedJson);
  });
  it('transform clustered entity', () => {
    const outAggregateWithEntityPath = path.join(OUTPUTS_DIR, AGGREGATE_WITH_ENTITY);
    const inAggregateWithEntityPath = path.join(INPUTS_DIR, AGGREGATE_WITH_ENTITY);

    const aggregateWithEntityJson = JSON.parse(
      fs.readFileSync(outAggregateWithEntityPath, 'utf-8'),
    );
    const expectedJson = JSON.parse(fs.readFileSync(inAggregateWithEntityPath, 'utf-8'));
    const modifiedJson = new CytoscapeAdapter(aggregateWithEntityJson).adapt();

    assert.deepStrictEqual(JSON.parse(modifiedJson), expectedJson);
  });
  it('adapts a simple bounded context', () => {
    const outSimpleBoundedContextPath = path.join(OUTPUTS_DIR, SIMPLE_BOUNDED_CONTEXT);
    const inSimpleBoundedContextPath = path.join(INPUTS_DIR, SIMPLE_BOUNDED_CONTEXT);

    const simpleBoundedContextJson = JSON.parse(
      fs.readFileSync(outSimpleBoundedContextPath, 'utf-8'),
    );
    const expectedJson = JSON.parse(fs.readFileSync(inSimpleBoundedContextPath, 'utf-8'));
    const modifiedJson = new CytoscapeAdapter(simpleBoundedContextJson).adapt();
    assert.deepStrictEqual(JSON.parse(modifiedJson), expectedJson);
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
});
