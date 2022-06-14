import {Command, Flags} from '@oclif/core'

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
      name: 'directory',
      required: false,
      description: 'output directory',
      default: 'candy-build',
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

    const outputDirectory = flags['output-dir'] ?? 'candy-build'
    const candyBoardVersion = flags['board-version'] ?? 'latest'
    this.log(
      `hello ${outputDirectory}[${candyBoardVersion}] from C:\\dev\\repositories\\candy-cli\\src\\commands\\generate.ts`,
    )
    if (args.directory && flags['output-dir']) {
      this.log(`you input --output-dir: ${args.directory}`)
    }
  }
}
