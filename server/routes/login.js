/*
 * Copyright (c) 2016 TIBCO Software Inc.
 * All Rights Reserved.
 */
var Q = require('q');
var appRouter = function(app) {

  app.get("/", function (req, res) {
    var deferred = Q.defer();
    var json = {
      data: "Please login.",
      status: 0
    };
    if (req.session.user) {
      json = {
        data: "You already login.",
        status: 1
      };
    }
    deferred.resolve(json);
    return deferred.promise.then(function(){
      res.send(json);
    });
  });

  app.post("/login", function (req, res) {
    var deferred = Q.defer();
    var json = {
      data: "login failed",
      status: 0
    };
    if (req.body.username === 'admin' && req.body.password === 'admin') {
      req.session.regenerate(function(err) {
        req.session.user = req.query.username;
        json = {
          data: "login successful",
          status: 1
        };
        deferred.resolve(json);
      });
    }else{
      deferred.resolve(json);
    }
    return deferred.promise.then(function(){
      res.send(json);
    });
  });

  app.get("/logout", function (req, res) {
    var json = {
      data: "logout",
      status: 1
    };
    req.session.destroy();
    return res.send(json);
  });
};
module.exports = appRouter;