var express = require('express');
var _ = require('underscore');
var app = express();
var server = require('http').createServer(app);
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var config = require('./lib/config');
var redis = require("redis");
var secret = require('./lib/secret');
var connect = require('connect');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var async;

var Riak;
if(process.env.RIAK_NODES) {
  async = require('async');
  Riak = require('basho-riak-client');
}

var dbType = getDbType();
app.locals.dbType = dbType;
function getDbType() {
  if(Riak && process.env.RIAK_NODES) {
    return 'riak';
  } else {
    return 'redis';
  }
}

var client = null;
if(dbType == 'riak') {
  client = new Riak.Client(process.env.RIAK_NODES.split(','));
} else if(process.env.REDISTOGO_URL) { //heroku
  client = require('redis-url').connect(process.env.REDISTOGO_URL); 
} else if(config.env == "development") {
  client = redis.createClient();
}  else { //nodejitsu
  client = redis.createClient(secret.redisPort, secret.redisMachine);
  client.auth(secret.redisAuth, function (err) {
     if (err) { throw err; }
  });
}

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use('/public', express.static('public'));

app.use(methodOverride());
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: guid()}));

//helper method for writing out json payloads
var json = function(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

  if(typeof data === "string") res.write(data);

  else res.write(JSON.stringify(data));

  res.end();
};

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/todos', function(req, res) {
  var values;
  if(dbType == 'riak') {
    // Listing is not a common operation in Riak
    // Here we store the ids of each item in a array and then we make async queries to retrieve all of them
    client.fetchValue({ bucket: 'todos', key: 'ids', convertToJs: true},
      function (err, rslt) {
        var ids, todos;
        if (err) {
          throw new Error(err);
        } else {
          var riakObj;
          if(rslt.isNotFound) {
            json(res, []);
          } else {
            riakObj = rslt.values.shift();
            ids = riakObj.value;

            async.map(ids,
                function(id, callback) {
                  client.fetchValue({bucket: 'todos', key: id, convertToJs: true},
                      function(err, rslt) {
                        var todo = null, riakObj;
                        if (!rslt.isNotFound) {
                          riakObj = rslt.values.shift();
                          if(riakObj)
                            todo = riakObj.value;
                        }
                        callback(null, todo)
                      });
            }, function(err, rslt) {
                  if(err) {
                    json(res, []);
                  } else {
                    var obj = {};
                    // convert the array of items into an object with keys pointing the items
                    rslt.forEach(function(item) {
                      if(item)
                        obj[item.id] = item.description;
                    });
                    json(res, obj);
                  }
            });
          }
        }
      }
    );
  } else {
    client.hgetall("todos", function (err, data) {
      json(res, data);
    });
  }
});

app.post('/todos/create', function(req, res) {
  var id = guid();
  if(dbType == 'riak') {
    var createIdsCounter = 0;
    var createIds = function(callback) {
      client.fetchValue({bucket: 'todos', key: 'ids', convertToJs: true},
          function (err, rslt) {
            var todos_ids;
            if (rslt.isNotFound) {
              client.storeValue({
                    convertToJs: true,
                    bucket: 'todos',
                    key: 'ids',
                    value: [id]
                  },
                  function (err, rslt) {
                    if(createIdsCounter < 2) {
                      createIdsCounter += 1;
                      createIds(callback);
                    }
                  }
              );
            } else {
              todos_ids = rslt.values.shift();
              if(todos_ids) {
                callback(err, todos_ids);
              }
            }
          });
    };
    async.waterfall([createIds,
      function(todos_ids, callback) {
      client.storeValue({
            convertToJs: true,
            bucket: 'todos',
            key: id,
            value: {id: id, description: req.body.description}
          },
          function (err, rslt) {
            var tmp = todos_ids.value;
            tmp.push(id);
            todos_ids.setValue(tmp);
            callback(err, todos_ids)
          }
      );
    }, function(todos_ids, callback) {
      client.storeValue({
            convertToJs: true,
          value: todos_ids
          },
          function (err, rslt) {
            callback(err);
          }
        );
    }], function(err, result) {
      if(!err) {
        json(res, {id: id});
      } else {
        json(res, {});
        throw new Error(err);
      }
    });
  } else {
    client.hset("todos", id, req.body.description);
    json(res, { id: id });
  }
});

app.post('/todos/update', function(req, res) {
  if(dbType == 'riak') {
    client.storeValue({
          convertToJs: true,
          bucket: 'todos',
          key: req.body.id,
          value: {id: req.body.id, description: req.body.description}
        },
        function (err, rslt) {
          json(res, {});
        });
  } else {
    client.hset("todos", req.body.id, req.body.description);

    json(res, {});
  }
});

app.post('/todos/delete', function(req, res) {
  var id = req.body.id;
  if(dbType == 'riak') {

    async.waterfall([function(callback) {

      client.fetchValue({bucket: 'todos', key: 'ids', convertToJs: true},
        function (err, rslt) {
          var todos_ids;
          if (rslt.isNotFound) {
            callback(null, []);
          } else {
            todos_ids = rslt.values.shift();
            if (todos_ids) {
              callback(err, todos_ids);
            }
          }
        });
      }, function(todos_ids, callback) {
        var i, tmp = todos_ids.value;
        i = tmp.indexOf(id);
        tmp.splice(i, 1);
        todos_ids.setValue(tmp);
        client.storeValue({convertToJs: true, value: todos_ids}, function(err, rslt) {
          callback(err);
        })
      }, function(callback) {
        client.deleteValue({bucket: 'todos', key: id}, function (err, rslt) {
          callback(err);
        });
    }], function(err) {
      json(res, {});
    });
  } else {
    client.hdel("todos", id);
    json(res, {});
  }
});

server.listen(process.env.PORT || config.port);
