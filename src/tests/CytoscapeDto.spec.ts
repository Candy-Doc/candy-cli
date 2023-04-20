import path from 'path';
import fs from 'fs';
import assert from 'assert';
import type {CytoscapeNode} from '../model/CytoscapeNode';
import {CytoscapeDto} from '../model/DTO/CytoscapeDto';
import {CytoscapeEdge} from "../model/CytoscapeEdge";

const INPUTS_DIR = 'src/tests/resources/ui_inputs';

const ALONE_AGGREGATE = 'alone_aggregate.json';
const aloneAggregatePath = path.join(INPUTS_DIR, ALONE_AGGREGATE);
const aloneAggregateJson: JSON = JSON.parse(fs.readFileSync(aloneAggregatePath, 'utf-8'));

const AGGREGATE_WITH_EDGES = 'aggregate_with_edges.json';
const aggregateWithEdgesPath = path.join(INPUTS_DIR, AGGREGATE_WITH_EDGES);
const aggregateWithEdgesJson = JSON.parse(fs.readFileSync(aggregateWithEdgesPath, 'utf-8'));

const boundedContext: CytoscapeNode = {
  data: {
    id: 'Bounded context one',
    label: 'Bounded context one',
  },
  classes: 'boundedContext',
};
const aggregate: CytoscapeNode = {
  data: {
    id: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.AggregateOne',
    label: 'AggregateOne',
    parent: 'Bounded context one',
  },
  classes: 'aggregate',
};
const domainCommand: CytoscapeNode = {
  data: {
    id: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.DomainCommandOne',
    label: 'DomainCommandOne',
    parent: 'Bounded context one',
  },
  classes: 'domainCommand',
};
const domainEvent: CytoscapeNode = {
  data: {
    id: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.DomainEventOne',
    label: 'DomainEventOne',
    parent: 'Bounded context one',
  },
  classes: 'domainEvent',
};
const edgeFromEventToAggregate: CytoscapeEdge = {
  data: {
    id: 1,
    source: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.DomainEventOne',
    target: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.AggregateOne',
  },
};
const edgeFromAggregateToCommand: CytoscapeEdge = {
  data: {
    id: 2,
    source: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.AggregateOne',
    target: 'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.DomainCommandOne',
  },
};

describe('Cytoscape DTO', () => {
  it('write a Json file for cytoscape', function () {
    const elements = [boundedContext, aggregate];
    const cytoscapeDto = new CytoscapeDto(elements);
    assert.equal(cytoscapeDto.json(), JSON.stringify(aloneAggregateJson));
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
    assert.equal(cytoscapeDto.json(), JSON.stringify(aggregateWithEdgesJson));
  });
});
