import got from 'got'

export default function createDownloadStream(url: string) {
  return got.stream(url)
}
