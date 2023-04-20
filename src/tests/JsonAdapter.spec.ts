import { describe } from 'mocha';
import assert from 'assert';
import path from 'path';
import * as fs from 'fs';
import { Adapter } from '../tools/Adapter';

const OUTPUTS_DIR = 'src/tests/resources/plugin_outputs';
const INPUTS_DIR = 'src/tests/resources/ui_inputs';
const ALONE_AGGREGATE = 'alone_aggregate.json';

describe('Json Adapter from plugin output to candy-board input', () => {
  it('should transform concepts', function () {
    const outputAggregatePath = path.join(OUTPUTS_DIR, ALONE_AGGREGATE);
    const inputAggregatePath = path.join(INPUTS_DIR, ALONE_AGGREGATE);

    const outputJson = JSON.parse(fs.readFileSync(outputAggregatePath, 'utf-8'));
    const expectedJson = JSON.parse(fs.readFileSync(inputAggregatePath, 'utf-8'));

    const modifiedJson = Adapter.cytoscapeAdapter(outputJson);

    assert.equal(JSON.stringify(modifiedJson), JSON.stringify(expectedJson));
  });
});
