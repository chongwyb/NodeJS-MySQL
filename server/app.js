const http = require('http');
const mysql = require('mysql');

const routes = require('./routes');

const hostname = '127.0.0.1';
const port = 3000;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
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