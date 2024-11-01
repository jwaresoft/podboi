# Test Setup

Sets up files for file related tests.  We copy to `/tmp/podboi-test-files` to ensure no changes from previous tests runs are lying around.

Setup operations happen in `./testSetup.js`.  This is orchestrated in `../vitest.config.js`.

|File|Usage|
|----|-----|
|groovy-ambient-funk.mp3| used as a readable stream to test downloads|
|groovy-ambient-funk-2tag.mp3| used to test file tagging on an untagged file|
|feedFile.txt|used to test plain text parsing|
|feedFile.csv| used to test csv file parsing|
|feedFileBlanks.csv| used to test csv file parsing when a file has blank lines|




