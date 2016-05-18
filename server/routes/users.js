/*
 * Copyright (c) 2016 TIBCO Software Inc.
 * All Rights Reserved.
 */
var Q = require('q');
var appRouter = function(app) {

  app.get("/auth/users", function (req, res) {
    var deferred = Q.defer();
    var json = {
      data: "get user list.",
      status: 1
    };
    deferred.resolve(json);
    return deferred.promise.then(function(){
      res.send(json);
    });
  });
};
module.exports = appRouter;