## Unit test
The unit tests are created using request, mocha, chai.

### Base unit tests
The default test cases are separated into two sets, [valid](/tests/valid) and [invalid](/tests/invalid), imported in /tests/index.js to be executed.

NOTE:
- Valid Test Cases are run in order to simulate an actual process.
- Valid Test Case 1-1 and Invalid Test Case 1-1 only works once when SEED is loaded.

### Custom unit tests
To add or modify the test cases for the respective api routes, you can set them in
- /tests/valid/caseX.js
- /tests/invalid/caseX.js

Reload the SEED to test the new test cases.

### Custom database records
To include more variations of test cases, you can modify the SEED [here](/server/seed.js).

Reload the SEED to test the new test cases.