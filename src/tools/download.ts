import got from 'got';

export function createDownloadStream(url: string) {
  return got.stream(url);
}
