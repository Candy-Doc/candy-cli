import {Command, Flags} from '@oclif/core'
import pipeline from '../../generate-tools/pipeline'
import JSONNotFound from '../../errors/json-not-found'
import fs from 'node:fs'

const {CANDY_DOC_INPUT_PATH, CANDY_DOC_OUTPUT_PATH, CANDY_DOC_BOARD_VERSION} =
  process.env
export default class Generate extends Command {
  static description = 'It generates Svelte artifact with JSON schema in it';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'output-dir': Flags.string({
      char: 'o',
      name: 'output-dir',
      description: 'Output path of artifact',
      default: CANDY_DOC_OUTPUT_PATH ? CANDY_DOC_OUTPUT_PATH : '.',
    }),
    'board-version': Flags.string({
      char: 'b',
      name: 'board-version',
      description: 'Version of Candy-Board',
      default: CANDY_DOC_BOARD_VERSION ? CANDY_DOC_BOARD_VERSION : 'latest',
    }),
  };

  static args = [
    {
      name: 'jsonPath',
      required: false,
      description: 'JSON file from Candy-Doc Maven plugin',
      default: CANDY_DOC_INPUT_PATH ?
        CANDY_DOC_INPUT_PATH :
        'target/candy-doc/candy-data.json',
    },
  ];

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Generate)
    const {
      'output-dir': outputDirectory,
      'board-version': candyBoardVersion,
    } = flags
    const {jsonPath} = args

    if (!fs.existsSync(jsonPath)) {
      throw new JSONNotFound(
        `${jsonPath} doesn't exists. Please enter valid JSON file path.`,
      )
    }

    this.log(`Candy-CLI is reading ${jsonPath}...`)
    this.log(
      `Output will be put in ${outputDirectory} directory with candy-board [${candyBoardVersion}]`,
    )
    if (outputDirectory) {
      this.log(`You specified output directory: ${outputDirectory}`)
    }

    if (candyBoardVersion) {
      this.log(`You specified Candy-Board version: ${candyBoardVersion}`)
    }

    await pipeline(jsonPath, outputDirectory)
  }
}
