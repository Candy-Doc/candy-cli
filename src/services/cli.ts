import { Builtins, Cli } from 'clipanion';
import { version } from '../../package.json';

const cli = new Cli({
  binaryLabel: `Candy doc`,
  binaryName: `candy-doc`,
  binaryVersion: version,
});

cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);

export default cli;
