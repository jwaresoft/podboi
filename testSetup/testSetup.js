/* istanbul ignore file */
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";


const fileFullPath = fileURLToPath(import.meta.url);
const pathToHere = path.dirname(fileFullPath);
const testFiles = path.join(pathToHere, "podboi-test-files");
const tempDestination = path.join(tmpdir(), 'podboi-test-files')

/**
 * sets up test files for testing file functions.  Copies to /tmp
 */
export function setup() {
  console.log("setting up test files in tmp")


  if(existsSync(tempDestination)) {
    rmSync(tempDestination ,{ recursive: true })
    console.log("removed old test files")
  }

  cpSync(testFiles, tempDestination, { recursive: true });
}

/**
 * remove test dir to not break consecutive tests runs
 */
export function teardown() {
  if(existsSync(tempDestination)) {
    rmSync(tempDestination ,{ recursive: true })
    console.log("removed old test files")
  }
}