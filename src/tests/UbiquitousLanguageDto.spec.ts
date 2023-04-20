import { describe } from 'mocha';
import path from 'path';
import fs from 'fs';
import { UbiquitousLanguageDto } from '../model/DTO/UbiquitousLanguageDto';
import assert from 'assert';

const OUTPUTS_DIR = 'src/tests/resources/plugin_outputs';
const ALONE_AGGREGATE = 'alone_aggregate.json';

describe('Ubiquitous language DTO', () => {
  it('capture correctly ubiquitous language from json', () => {
    const outputAggregatePath = path.join(OUTPUTS_DIR, ALONE_AGGREGATE);
    const outputJson = JSON.parse(fs.readFileSync(outputAggregatePath, 'utf-8'));
    const ubiquitousLanguageDto = new UbiquitousLanguageDto(outputJson);

    assert.equal(ubiquitousLanguageDto.type, 'BOUNDED_CONTEXT');
    assert.equal(ubiquitousLanguageDto.name, 'Bounded context one');
    assert.equal(ubiquitousLanguageDto.description, 'Describe the bounded context here');
    assert.equal(ubiquitousLanguageDto.domainModels.size, 1);
    assert.equal(
      ubiquitousLanguageDto.domainModels.get(
        'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.AggregateOne',
      )?.type,
      'AGGREGATE',
    );
    assert.equal(
      ubiquitousLanguageDto.domainModels.get(
        'io.candydoc.ddd.sample.one_valid_bounded_context.feature_A.AggregateOne',
      )?.dependencies.length,
      0,
    );
  });
});
