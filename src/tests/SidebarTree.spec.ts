import { describe } from 'mocha';
import assert from 'assert';
import path from 'path';
import * as fs from 'fs';
import { ManifestJson } from '../model/ManifestJson';
import { Manifest } from '../model/Manifest';
import { CytoscapeAdapter } from '../tools/adapter/CytoscapeAdapter';

import aloneAggregate from './resources/ui_inputs/Sidebar/one_aggregate.json';
import aggregateWithEdges from './resources/ui_inputs/Sidebar/aggregate_with_edges.json';
import aggregateWithEntity from './resources/ui_inputs/Sidebar/aggregate_with_entity.json';
import simpleBoundedContext from './resources/ui_inputs/Sidebar/simple_bounded_context.json';
import entityWithTwoParents from './resources/ui_inputs/Sidebar/entity_with_two_parents.json';
import entityWithTwoParentsAndChildren from './resources/ui_inputs/Sidebar/entity_with_two_parents_and_children.json';
import orphanVocabulary from './resources/ui_inputs/Sidebar/orphan_vocabulary.json';
import twoBoundedContextsAndAnOrphan from './resources/ui_inputs/Sidebar/two_bounded_contexts_and_an_orphan.json';
import twoBoundedContextsAndASharedKernel from './resources/ui_inputs/Sidebar/two_bounded_contexts_and_a_shared_kernel.json';

const OUTPUTS_DIR_MANIFEST = 'src/tests/resources/plugin_outputs/manifests';
const OUTPUTS_DIR = 'src/tests/resources/plugin_outputs';
const ALONE_AGGREGATE = 'alone_aggregate.json';
const AGGREGATE_WITH_EDGES = 'aggregate_with_edges.json';
const AGGREGATE_WITH_ENTITY = 'aggregate_with_entity.json';
const SIMPLE_BOUNDED_CONTEXT = 'simple_bounded_context.json';
const JSON_WITH_UNKNOWN_PATTERN = 'json_with_unknown_pattern.json';
const ENTITY_WITH_TWO_PARENTS = 'entity_with_two_parents.json';
const ENTITY_WITH_TWO_PARENTS_AND_CHILDREN = 'entity_with_two_parents_and_children.json';
const ORPHAN_VOCABULARY = 'orphan_vocabulary.json';

const TWO_BOUNDED_CONTEXTS_AND_AN_ORPHAN_MANIFEST = 'two_bounded_contexts_and_an_orphan';
const TWO_BOUNDED_CONTEXTS_AND_A_SHARED_KERNEL_MANIFEST =
  'two_bounded_contexts_and_a_shared_kernel';

const buildActualJsonForSidebarFrom = (fileName: string) => {
  const filePath = path.join(OUTPUTS_DIR, fileName);
  const jsonFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const cyAdapter = new CytoscapeAdapter(Array.of(jsonFile));
  cyAdapter.adapt();
  return JSON.parse(cyAdapter.getSidebarTree());
};

const buildActualJsonForSidebarfromManifest = (dirName: string) => {
  const filePath = path.join(OUTPUTS_DIR_MANIFEST, dirName + '/MANIFEST.json');
  const manifestJson: ManifestJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const manifest = new Manifest(manifestJson, path.join(OUTPUTS_DIR_MANIFEST, dirName));
  manifest.adapt();
  return manifest.getSidebarTree();
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
        const adapter = new CytoscapeAdapter(Array.of(jsonWithUnknownPattern));
        adapter.adapt();
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
  it('gathers all orphan vocabulary under the orphan vocabulary node', () => {
    const modifiedJson = buildActualJsonForSidebarFrom(ORPHAN_VOCABULARY);

    assert.deepStrictEqual(modifiedJson, orphanVocabulary);
  });
  it('creates two bounded context and an orphan vocabulary', () => {
    const modifiedJson = buildActualJsonForSidebarfromManifest(
      TWO_BOUNDED_CONTEXTS_AND_AN_ORPHAN_MANIFEST,
    );

    assert.deepStrictEqual(modifiedJson, twoBoundedContextsAndAnOrphan);
  });
  it('merges two simple bounded context with a shared kernel', () => {
    const modifiedJson = buildActualJsonForSidebarfromManifest(
      TWO_BOUNDED_CONTEXTS_AND_A_SHARED_KERNEL_MANIFEST,
    );

    assert.deepStrictEqual(modifiedJson, twoBoundedContextsAndASharedKernel);
  });
});
