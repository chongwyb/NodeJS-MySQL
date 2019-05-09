# NodeJS MySQL

## Prerequisites
Refer to the setup guide [here](./instructions/SETUP.md) to install the necessary software tools.

## Configuration
These changes apply to /server/config/development.js which can be found [here](./server/config/development.js).

### Server connection
Set yout preferred IP address and port number for the server.
```javascript
  domain_name: "http://localhost:3000",
  HOSTNAME: '127.0.0.1',
  PORT: 3000,
```

### MYSQL DB connection
Set your MYSQL DB connection parameters.
```javascript
  MYSQL_USERNAME: 'root', // Enter your MYSQL DB username
  MYSQL_PASSWORD: 'password', // Enter your MYSQL DB password
  MYSQL_HOSTNAME: 'localhost', // Enter your MYSQL DB hostname
  MYSQL_DATABASE: 'school', // Enter your MYSQL DB database
  MYSQL_PORT: 3306, // Enter your MYSQL DB port number
```
### MYSQL logging
To enable MYSQL statement logging.
```javascript
  MYSQL_LOGGING: false, // Set to true
```

### Database initialisation
To create the necessary tables.
```javascript
  INIT: false,
```
To drop and create the necessary tables.
```javascript
  INIT: true,
```
To create pseudo table records.
```javascript
  SEED: true,
```

### Unit tests
To enable unit tests.
```javascript
  TEST: true,
```
For more information on generating additional test cases, click [here](./instructions/UNIT_TEST.md).

## Launching the application
Install the necessary NPM packages
```
$ npm i
```

Start the application
```
$ npm run start:dev
```