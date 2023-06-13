import { describe } from 'mocha';
import assert from 'assert';
import path from 'path';
import * as fs from 'fs';

import { CytoscapeAdapter } from '../tools/adapter/CytoscapeAdapter';
import aloneAggregate from './resources/ui_inputs/Sidebar/one_aggregate.json';
import aggregateWithEdges from './resources/ui_inputs/Sidebar/aggregate_with_edges.json';
import aggregateWithEntity from './resources/ui_inputs/Sidebar/aggregate_with_entity.json';
import simpleBoundedContext from './resources/ui_inputs/Sidebar/simple_bounded_context.json';
import entityWithTwoParents from './resources/ui_inputs/Sidebar/entity_with_two_parents.json';
import entityWithTwoParentsAndChildren from './resources/ui_inputs/Sidebar/entity_with_two_parents_and_children.json';
// import eventPointingOnAValueObject from './resources/ui_inputs/event_pointing_on_a_value_object.json';
// import eventAndCommandPointingOnAValuueObject from './resources/ui_inputs/event_and_command_pointing_on_a_value_object.json';

const OUTPUTS_DIR = 'src/tests/resources/plugin_outputs';
const ALONE_AGGREGATE = 'alone_aggregate.json';
const AGGREGATE_WITH_EDGES = 'aggregate_with_edges.json';
const AGGREGATE_WITH_ENTITY = 'aggregate_with_entity.json';
const SIMPLE_BOUNDED_CONTEXT = 'simple_bounded_context.json';
const JSON_WITH_UNKNOWN_PATTERN = 'json_with_unknown_pattern.json';
const ENTITY_WITH_TWO_PARENTS = 'entity_with_two_parents.json';
const ENTITY_WITH_TWO_PARENTS_AND_CHILDREN = 'entity_with_two_parents_and_children.json';
// const EVENT_POINTING_ON_A_VALUE_OBJECT = 'event_pointing_on_a_value_object.json';
// const EVENT_AND_COMMAND_POINTING_ON_A_VALUE_OBJECT =
//   'event_and_command_pointing_on_a_value_object.json';

const buildActualJsonForSidebarFrom = (fileName: string) => {
  const filePath = path.join(OUTPUTS_DIR, fileName);
  const jsonFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const cyAdapter = new CytoscapeAdapter(Array.of(jsonFile));
  cyAdapter.adapt();
  const sidebar = cyAdapter.getSidebarTree();
  return JSON.parse(sidebar);
};

describe('Json Adapter to collect concepts for the sidebar', () => {
  it('adapts concepts', function () {
    const modifiedJson = buildActualJsonForSidebarFrom(ALONE_AGGREGATE);

    assert.deepStrictEqual(modifiedJson, aloneAggregate);
  });
  it('adapts concepts with edges', () => {
    const modifiedJson = buildActualJsonForSidebarFrom(AGGREGATE_WITH_EDGES);

    assert.deepStrictEqual(modifiedJson, aggregateWithEdges);
  });
  it('adapts clustered entity', () => {
    const modifiedJson = buildActualJsonForSidebarFrom(AGGREGATE_WITH_ENTITY);

    assert.deepStrictEqual(modifiedJson, aggregateWithEntity);
  });
  it('adapts a simple bounded context', () => {
    const modifiedJson = buildActualJsonForSidebarFrom(SIMPLE_BOUNDED_CONTEXT);

    assert.deepStrictEqual(modifiedJson, simpleBoundedContext);
  });
  it('throw an error if the pattern is not known', () => {
    const jsonWithUnknownPatternPath = path.join(OUTPUTS_DIR, JSON_WITH_UNKNOWN_PATTERN);
    const jsonWithUnknownPattern = JSON.parse(fs.readFileSync(jsonWithUnknownPatternPath, 'utf-8'));
    assert.throws(
      () => {
        const modifiedJson = new CytoscapeAdapter(Array.of(jsonWithUnknownPattern)).adapt();
      },
      {
        name: 'Error',
        message: 'PatternFormatter : The pattern UNKNOWN_PATTERN is unknown.',
      },
    );
  });
  it('duplicates shared nodes into each parents', () => {
    const modifiedJson = buildActualJsonForSidebarFrom(ENTITY_WITH_TWO_PARENTS);

    assert.deepStrictEqual(modifiedJson, entityWithTwoParents);
  });
  it('duplicates shared nodes and their children', () => {
    const modifiedJson = buildActualJsonForSidebarFrom(ENTITY_WITH_TWO_PARENTS_AND_CHILDREN);

    assert.deepStrictEqual(modifiedJson, entityWithTwoParentsAndChildren);
  });
});
