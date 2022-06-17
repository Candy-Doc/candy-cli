import {Command, Flags} from '@oclif/core'
import pipeline from '../../generate-tools/pipeline'
import JSONNotFound from '../../errors/json-not-found'
import fs from 'node:fs'

export default class Generate extends Command {
  static description = 'It generates Svelte artifact with JSON schema in it';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    'output-dir': Flags.string({
      char: 'o',
      name: 'output-dir',
      description: 'Output path of artifact',
    }),
    'board-version': Flags.string({
      char: 'b',
      name: 'board-version',
      description: 'Version of Candy-Board',
    }),
  };

  static args = [
    {
      name: 'jsonPath',
      required: false,
      description: 'JSON file from Candy-Doc Maven plugin',
      default: 'target/candy-doc/candy-data.json',
    },
    {
      name: 'directory',
      required: false,
      description: 'output directory where we put candy-build folder',
      default: '.',
    },
    {
      name: 'version',
      required: false,
      description: 'version of Candy-Board',
      default: 'latest',
    },
  ];

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Generate)

    if (!fs.existsSync(args.jsonPath)) {
      throw new JSONNotFound(`${args.jsonPath} doesn't exists. Please enter valid JSON file path.`)
    }

    const outputDirectory = flags['output-dir'] ?? '.'
    const candyBoardVersion = flags['board-version'] ?? 'latest'
    this.log(`Candy-CLI is reading ${args.jsonPath}...`)
    this.log(`Output will be put in ${outputDirectory} directory with candy-board [${candyBoardVersion}]`)
    if (args.directory && flags['output-dir']) {
      this.log(`You specified output directory: ${args.directory}`)
    }

    if (args.version && flags['board-version']) {
      this.log(`You specified Candy-Board version: ${args.version}`)
    }

    await pipeline(args.jsonPath, outputDirectory)
  }
}
