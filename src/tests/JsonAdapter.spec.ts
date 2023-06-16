import { describe } from 'mocha';
import assert from 'assert';
import path from 'path';
import * as fs from 'fs';
import { CytoscapeAdapter } from '../tools/adapter/CytoscapeAdapter';

import aloneAggregate from './resources/ui_inputs/alone_aggregate.json';
import aggregateWithEdges from './resources/ui_inputs/aggregate_with_edges.json';
import aggregateWithEntity from './resources/ui_inputs/aggregate_with_entity.json';
import simpleBoundedContext from './resources/ui_inputs/simple_bounded_context.json';
import ubiquitousLanguageWithNotAllowedDependencies from './resources/ui_inputs/ubiquitous_language_with_not_allowed_dependencies.json';
import entityWithTwoParents from './resources/ui_inputs/entity_with_two_parents.json';
import eventPointingOnAValueObject from './resources/ui_inputs/event_pointing_on_a_value_object.json';
import eventAndCommandPointingOnAValuueObject from './resources/ui_inputs/event_and_command_pointing_on_a_value_object.json';

const OUTPUTS_DIR = 'src/tests/resources/plugin_outputs';
const ALONE_AGGREGATE = 'alone_aggregate.json';
const AGGREGATE_WITH_EDGES = 'aggregate_with_edges.json';
const AGGREGATE_WITH_ENTITY = 'aggregate_with_entity.json';
const SIMPLE_BOUNDED_CONTEXT = 'simple_bounded_context.json';
const JSON_WITH_UNKNOWN_PATTERN = 'json_with_unknown_pattern.json';
const UBIQUITOUS_LANGUAGE_WITH_NOT_ALLOWED_DEPENDENCIES =
  'ubiquitous_language_with_not_allowed_dependencies.json';
const ENTITY_WITH_TWO_PARENTS = 'entity_with_two_parents.json';
const EVENT_POINTING_ON_A_VALUE_OBJECT = 'event_pointing_on_a_value_object.json';
const EVENT_AND_COMMAND_POINTING_ON_A_VALUE_OBJECT =
  'event_and_command_pointing_on_a_value_object.json';
const DEPENDENCIES_TO_NON_EXISTING_NODES = 'dependencies_to_non_existing_nodes.json';

const buildActualJsonForCytoscapeFrom = (fileName: string) => {
  const filePath = path.join(OUTPUTS_DIR, fileName);
  const jsonFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const adaptedJson = new CytoscapeAdapter().adapt(jsonFile);
  return JSON.parse(adaptedJson);
};

describe('Json Adapter from plugin output to candy-board input', () => {
  it('adapts concepts', function () {
    const modifiedJson = buildActualJsonForCytoscapeFrom(ALONE_AGGREGATE);

    assert.deepStrictEqual(modifiedJson, aloneAggregate);
  });
  it('adapts concepts with edges', () => {
    const modifiedJson = buildActualJsonForCytoscapeFrom(AGGREGATE_WITH_EDGES);

    assert.deepStrictEqual(modifiedJson, aggregateWithEdges);
  });
  it('adapts clustered entity', () => {
    const modifiedJson = buildActualJsonForCytoscapeFrom(AGGREGATE_WITH_ENTITY);

    assert.deepStrictEqual(modifiedJson, aggregateWithEntity);
  });
  it('adapts a simple bounded context', () => {
    const modifiedJson = buildActualJsonForCytoscapeFrom(SIMPLE_BOUNDED_CONTEXT);

    assert.deepStrictEqual(modifiedJson, simpleBoundedContext);
  });
  it('throw an error if the pattern is not known', () => {
    const jsonWithUnknownPatternPath = path.join(OUTPUTS_DIR, JSON_WITH_UNKNOWN_PATTERN);
    const jsonWithUnknownPattern = JSON.parse(fs.readFileSync(jsonWithUnknownPatternPath, 'utf-8'));
    assert.throws(
      () => {
        new CytoscapeAdapter().adapt(jsonWithUnknownPattern);
      },
      {
        name: 'Error',
        message: 'PatternFormatter : This pattern is unknown.',
      },
    );
  });
  it('creates errors from not allowed dependencies', () => {
    const modifiedJson = buildActualJsonForCytoscapeFrom(
      UBIQUITOUS_LANGUAGE_WITH_NOT_ALLOWED_DEPENDENCIES,
    );

    assert.deepStrictEqual(modifiedJson, ubiquitousLanguageWithNotAllowedDependencies);
  });
  it('creates edges for an entity/value object shared by 2 parents', () => {
    const modifiedJson = buildActualJsonForCytoscapeFrom(ENTITY_WITH_TWO_PARENTS);

    assert.deepStrictEqual(modifiedJson, entityWithTwoParents);
  });
  it('creates edges for an entity/value object shared by 2 parents if one of them is not an aggregate/entity or VO', () => {
    const modifiedJson = buildActualJsonForCytoscapeFrom(EVENT_POINTING_ON_A_VALUE_OBJECT);

    assert.deepStrictEqual(modifiedJson, eventPointingOnAValueObject);
  });
  it('creates edges for a value object pointed by one event and one command', () => {
    const modifiedJson = buildActualJsonForCytoscapeFrom(
      EVENT_AND_COMMAND_POINTING_ON_A_VALUE_OBJECT,
    );

    assert.deepStrictEqual(modifiedJson, eventAndCommandPointingOnAValuueObject);
  });
  it('throw an error if a node does not exist', () => {
    const jsonWithUnknownNodesPath = path.join(OUTPUTS_DIR, DEPENDENCIES_TO_NON_EXISTING_NODES);
    const jsonWithUnknownNodes = JSON.parse(fs.readFileSync(jsonWithUnknownNodesPath, 'utf-8'));
    assert.throws(
      () => {
        new CytoscapeAdapter().adapt(jsonWithUnknownNodes);
      },
      {
        name: 'Error',
        message:
          'CytoscapeAdapter: io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.WrongName does not exist.',
      },
    );
  });
});
