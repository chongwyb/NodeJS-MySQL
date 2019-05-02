# NodeJS MySQL

## Prerequisites
Refer to the setup guide [here](./SETUP.md)

## Running the application

### Set database connection
In /server/config/development.js, set the connection details to MYSQL accordingly.
```javascript
  MYSQL_USERNAME: '<username>',
  MYSQL_PASSWORD: '<password>',
  MYSQL_HOSTNAME: '<hostname>',
  MYSQL_DATABASE: '<database>',
  MYSQL_PORT: <port>,
```
### Launching the application
Install the necessary NPM packages
```
$ npm i
```

Start the application
```
$ npm run start:dev
```

## Unit test

### Base unit tests
In /server/config/development.js, enable for the database seed and unit tests.
```javascript
  SEED: true,
  TEST: true,
```
Re-run the application.

### Custom unit tests
In /server/tests/main.js, replace the base test cases with the custom test cases.
```javascript
// const <test case> = require('./<path to file>');

module.exports = async () => {
    // <test case>(); custom unit tests
}
```
Re-run the application.