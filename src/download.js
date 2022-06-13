import got from "got";

export default async function downloadCandyBoard() {
  console.log(await getPackageLatestVersionUrl('@candy-doc/board'));
}

export async function getPackageLatestVersionUrl(packageName) {
  const {body} = await got(`https://registry.npmjs.org/${packageName}/`, {
    responseType: 'json',
  });
  return body.versions[body['dist-tags'].latest].dist.tarball;
}

downloadCandyBoard();