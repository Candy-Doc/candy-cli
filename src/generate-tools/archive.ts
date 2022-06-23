import tar from 'tar'

export default function createUnTarStream(extractDir: string) {
  return tar.extract({
    cwd: extractDir,
    strip: 2,
  })
}
