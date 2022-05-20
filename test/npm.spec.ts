import assert from 'assert';
import { getPackageLatestVersionUrl } from '../src/tools/npm';
import { tenSec } from './tools';

describe('Archive suite', () => {
  it('should be able to resolve npm latest package version', async () => {
    assert.ok(await getPackageLatestVersionUrl('@candy-doc/board'));
  }).timeout(tenSec);
  it('should throw if not able to resolve npm package', async () => {
    assert.rejects(async () => await getPackageLatestVersionUrl('@candy-doc/boardrr'));
  });
});
