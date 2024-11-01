import { cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

/**
 * sets up test files for testing file functions.  Copies to /tmp
 */
export default function setup() {
  const fileFullPath = fileURLToPath(import.meta.url);
  const pathToHere = path.dirname(fileFullPath);
  const testFiles = path.join(pathToHere, "podboi-test-files");

  cpSync(testFiles, "/tmp/podboi-test-files", { recursive: true });
}
