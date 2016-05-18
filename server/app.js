/*
 * Copyright (c) 2016 TIBCO Software Inc.
 * All Rights Reserved.
 */
var express = require("express");
var bodyParser = require("body-parser");
var session = require('express-session');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.get("/auth/*", function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

require("./routes/login.js")(app);
require("./routes/users.js")(app);

var server = app.listen(3001, function () {
  console.log("Listening on port %s...", server.address().port);
});
