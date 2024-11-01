/* istanbul ignore file */
import { cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";

/**
 * sets up test files for testing file functions.  Copies to /tmp
 */
export default function setup() {
  const fileFullPath = fileURLToPath(import.meta.url);
  const pathToHere = path.dirname(fileFullPath);
  const testFiles = path.join(pathToHere, "podboi-test-files");
  const tempDestination = path.join(tmpdir(), 'podboi-test-files')

  cpSync(testFiles, tempDestination, { recursive: true });
}
