import { Command } from "commander";
const program = new Command();

program
  .name("podboi")
  .description(
    "A simple cli for bulk downloading entire podcast feeds with episode info as Id3 tags"
  )
  .version("0.0.0");

// TODO: Add entry commands
// https://github.com/tj/commander.js

program.parse();

// show help if nothing passed
if (program.args.length === 0) {
  program.help();
}
