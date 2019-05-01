const http = require('http');
const mysql = require('mysql');

const routes = require('./routes');
const config = require('./config');
const database = require('./database');
const seed = require('./seed');
const test = require('./tests/main');

const hostname = config.HOSTNAME;
const port = config.PORT || 3000;

const con = mysql.createConnection({
  host: config.MYSQL_HOSTNAME,
  user: config.MYSQL_USERNAME,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
});

con.connect(async (err) => {
  if (err) throw err;
  console.log(`Connected to MYSQL:${config.MYSQL_HOSTNAME}`);
  await database(con);

  if(config.SEED){
    await seed(con);
  }

  if(config.TEST){
    await test();
  }
});

const server = http.createServer((req, res) => {

  // Check if request is an api call
  if ((/^\/api/).test(req.url)) {
    routes(req, res, con);
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});