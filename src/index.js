const { program } = require('commander');
const generate = require('./generate');

program
  .command("generate")
  .argument("<json>", "candy-doc raw output path")
  .action(generate)

module.exports = program