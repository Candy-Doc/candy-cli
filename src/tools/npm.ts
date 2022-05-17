import got from 'got';

type PackageDetails = {
  'dist-tags': { latest: string };
  versions: {
    [key in PackageDetails['dist-tags']['latest']]: {
      dist: {
        tarball: string;
      };
    };
  };
};

export async function getPackageLatestVersionUrl(packageName: string) {
  const { body } = await got<PackageDetails>(`https://registry.npmjs.org/${packageName}/`, {
    responseType: 'json',
  });
  return body.versions[body['dist-tags'].latest].dist.tarball;
}
