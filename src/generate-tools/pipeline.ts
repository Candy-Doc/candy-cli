import {pipeline} from 'node:stream/promises'
import download from './download'
import npm from './npm'
import archive from './archive'

export default async function createPipeline() {
  const tarballUrl = await npm('@candy-doc/board')

  await pipeline(
    download(tarballUrl),
    archive('candy-build'),
  )
}
