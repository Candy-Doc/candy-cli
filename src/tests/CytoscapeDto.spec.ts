import path from 'path';
import fs from 'fs';
import assert from 'assert';
import type { CytoscapeNodeDto } from '../model/DTO/CytoscapeNodeDto';
import { CytoscapeDto } from '../model/DTO/CytoscapeDto';
import { CytoscapeEdgeDto } from '../model/DTO/CytoscapeEdgeDto';
import { CytoscapePattern } from '../tools/adapter/CytoscapePattern';

const INPUTS_DIR = 'src/tests/resources/ui_inputs';

const ALONE_AGGREGATE = 'alone_aggregate.json';
const aloneAggregatePath = path.join(INPUTS_DIR, ALONE_AGGREGATE);
const aloneAggregateJson: JSON = JSON.parse(fs.readFileSync(aloneAggregatePath, 'utf-8'));

const AGGREGATE_WITH_EDGES = 'aggregate_with_edges.json';
const aggregateWithEdgesPath = path.join(INPUTS_DIR, AGGREGATE_WITH_EDGES);
const aggregateWithEdgesJson = JSON.parse(fs.readFileSync(aggregateWithEdgesPath, 'utf-8'));

const boundedContext: CytoscapeNodeDto = {
  data: {
    id: 'Bounded context one',
    label: 'Bounded context one',
  },
  classes: CytoscapePattern.BOUNDED_CONTEXT,
};
const aggregate: CytoscapeNodeDto = {
  data: {
    id: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.AggregateOne',
    label: 'AggregateOne',
    parent: 'Bounded context one',
  },
  classes: CytoscapePattern.AGGREGATE,
};
const domainCommand: CytoscapeNodeDto = {
  data: {
    id: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.DomainCommandOne',
    label: 'DomainCommandOne',
    parent: 'Bounded context one',
  },
  classes: CytoscapePattern.DOMAIN_COMMAND,
};
const domainEvent: CytoscapeNodeDto = {
  data: {
    id: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.DomainEventOne',
    label: 'DomainEventOne',
    parent: 'Bounded context one',
  },
  classes: CytoscapePattern.DOMAIN_EVENT,
};
const edgeFromEventToAggregate: CytoscapeEdgeDto = {
  data: {
    id: 1,
    source: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.AggregateOne',
    target: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.DomainEventOne',
  },
};
const edgeFromAggregateToCommand: CytoscapeEdgeDto = {
  data: {
    id: 2,
    source: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.DomainCommandOne',
    target: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.AggregateOne',
  },
};

describe('Cytoscape DTO', () => {
  it('write a Json file for cytoscape', function () {
    const elements = [boundedContext, aggregate];
    const cytoscapeDto = new CytoscapeDto(elements);
    assert.deepStrictEqual(JSON.parse(cytoscapeDto.json()), aloneAggregateJson);
  });

  it('write a Json file with edges for cytoscape', function () {
    const elements = [
      boundedContext,
      aggregate,
      domainCommand,
      domainEvent,
      edgeFromEventToAggregate,
      edgeFromAggregateToCommand,
    ];
    const cytoscapeDto = new CytoscapeDto(elements);
    assert.deepStrictEqual(JSON.parse(cytoscapeDto.json()), aggregateWithEdgesJson);
  });
});
