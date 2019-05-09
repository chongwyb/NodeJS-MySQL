const express = require('express');
const bodyParser = require("body-parser");

// Initialise configuration
const config = require('./config');
const hostname = config.HOSTNAME;
const port = config.PORT || 3000;

// Initialise database
const database = require('./database');

// Initialise middleware
const app = express();
app.use(bodyParser.json());

// Initialise routes
const routes = require('./routes')(app, database);

// Error handler
// invalid routes
app.use((req, res) => {
	res.status(404).json({ "message": "Route Not Found" });
});
// server error
app.use((err, req, res, next) => {
  res.status(500).json({ "message": "Internal Server Error" });
});

// Initialise server
app.listen(port, hostname, 511, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});