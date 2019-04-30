# NodeJS MySQL

## Prerequisites
Refer to the setup guide [here](./SETUP.md)

## Running the application

### Set database connection
In /server/config/development.js, set the reference to MYSQL connection accordingly.
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
In /server/app.js, uncomment the code for the database seed and unit tests
```javascript
  await seed(con); // uncomment this line
  test(); // uncomment this line
```

### Custom unit tests
To include custom test cases, set them in /server.tests/main.js
```javascript
// const <test case> = require('./<path to file>');

module.exports = async () => {
    // <test case>(); custom unit tests
}
```