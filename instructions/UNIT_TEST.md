## Unit test

### Base unit tests
The default test cases are separately into two sets, [valid](/tests/valid) and [invalid](/tests/invalid).

NOTE:
- Valid Test Cases are run in order to simulate an actual process.
- Valid Test Case 1-1 and Invalid Test Case 1-1 only works once when SEED is loaded.

### Custom unit tests
To add or modify the test cases for each respective api routes, you can include them in /tests/valid/case<X>.js or /tests/invalid/case<X>.js.

Reload the SEED to test the new test cases.

### Custom database records
To include more variations of test cases, you can modify the SEED [here](/server/seed.js).

Reload the SEED to test the new test cases.