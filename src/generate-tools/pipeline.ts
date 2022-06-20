import {pipeline} from 'node:stream/promises'
import {copy} from 'fs-extra'
import path from 'node:path'
import download from './download'
import npm from './npm'
import archive from './archive'

export default async function createPipeline(
  jsonPath: string,
  outputDirectory: string,
) {
  const tarballUrl = await npm('@candy-doc/board')

  const outputDir = path.resolve(outputDirectory)
  const finalDir = path.join(outputDir, 'candy-build')
  await copy(jsonPath, `${finalDir}/candy-data.json`)

  await pipeline(download(tarballUrl), archive(finalDir))
}
