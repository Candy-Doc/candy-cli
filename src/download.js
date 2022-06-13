const got = require("got");

const downloadCandyBoard = () => {
  console.log(getPackageLatestVersionUrl('@candy-doc/board'));
}

function getPackageLatestVersionUrl(packageName) {
  return got(`https://registry.npmjs.org/${packageName}/`, {
    responseType: 'json',
  }).then(response => response.body.versions[response.body['dist-tags'].latest].dist.tarball);
}

module.exports = downloadCandyBoard;

downloadCandyBoard();