#! /usr/bin/env node
import { Command } from "commander";
import {handlePassedParamsAndRun} from "./podboi.js"

const program = new Command();

program
  .name("podboi")
  .description(
    "podcast bulk downloader.  Adds images and description (and more) as id3 tags."
  )
  .version("0.0.0");

program.configureHelp({
  helpWidth: 100,
});

program
  .option(
    "-o, --out <dir>",
    "output directory.  Defaults to current working directory."
  )
  .requiredOption(
    "-f, --feed <url, csv, txt>",
    "the feed url, or a file containing feed urls" +
      "  Feed files should be a csv with the first column containing the feed url, or a " +
      "plaintext file with each feed seperated by a new line."
  );

program.parse()

const options = program.opts()
const outDir = options.out ? options.out : process.cwd()
const feed = options.feed

handlePassedParamsAndRun(feed, outDir)