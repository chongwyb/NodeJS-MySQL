const http = require('http');
const mysql = require('mysql');

const routes = require('./routes');
const config = require('./config');

const hostname = config.HOSTNAME;
const port = config.PORT || 3000;

const con = mysql.createConnection({
  host: config.MYSQL_HOSTNAME,
  user: config.MYSQL_USERNAME,
  password: config.MYSQL_PASSWORD
});

con.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to MYSQL:${config.MYSQL_HOSTNAME}`);
});

const server = http.createServer((req, res) => {

  // Check if request is an api call
  if((/^\/api/).test(req.url)){
    routes(req, res, con);
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});