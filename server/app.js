const express = require('express');
const bodyParser = require("body-parser");

const config = require('./config');
const hostname = config.HOSTNAME;
const port = config.PORT || 3000;

const database = require('./database');

const app = express();
app.use(bodyParser.json());

const routes = require('./routes')(app, database);

// Error handler
// app.use((err, req, res, next) => {
//   res.status(500).json({ "message": "Internal Server Error" });
// });

app.listen(port, hostname, 511, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});