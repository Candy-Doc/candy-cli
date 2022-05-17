import tar from 'tar';

export function createUnTarStream(extractDir: string) {
  return tar.extract({
    cwd: extractDir,
    strip: 2,
  });
}
