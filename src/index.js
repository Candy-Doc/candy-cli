import {program} from 'commander'
import generate from './generate.js'

program
  .command("generate")
  .argument("<json>", "candy-doc raw output path")
  .action(generate)

export default program