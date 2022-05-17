import assert from 'assert';
import { getPackageLatestVersionUrl } from './npm';

describe('Archive suite', () => {
  it('should be able to resolve npm latest package version', async () => {
    assert.ok(await getPackageLatestVersionUrl('@candy-doc/board'));
  });
  it('should throw if not able to resolve npm package', async () => {
    assert.rejects(async () => await getPackageLatestVersionUrl('@candy-doc/boardrr'));
  });
});
