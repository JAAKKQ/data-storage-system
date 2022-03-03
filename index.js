const { strictEqual } = require('assert');
var async = require('async'),
    fs = require('graceful-fs'),
    path = require('path'),
    uuid = require('node-uuid'),
    mkdirp = require('mkdirp');

module.exports = function(dir) {
  dir = dir || path.join(process.cwd(), 'store');

  return {

    // store in this directory

    dir: dir,

    // list all stored objects by reading the file system

    list: function(cb) {
      var self = this;
      var action = function(err) {
        if (err) return cb(err);
        readdir(dir, function(err, files) {
          if (err) return cb(err);
          files = files.filter(function(f) { return f.substr(-5) === ".json"; });
          var fileLoaders = files.map(function(f) {
            return function(cb) {
              loadFile(f, cb);
            };
          });
          async.parallel(fileLoaders, function(err, objs) {
            if (err) return cb(err);
            sort(objs, cb);
          });
        })
      };
      mkdirp(dir, action);
    },


    // store an object to file

    add: function(id, Name, RawValue, cb) {
      var action = function(err) {
        if (err) return cb(err);
        var obj = "";
        var Value = RawValue.toString();
        const File = path.join(dir, id + '.json')
        if (fs.existsSync(File)) {
          // path exists
          fs.readFile(path.join(dir, id + '.json'), 'utf8', function(err, code) {
            if (err) return cb("error loading file" + err);
            try {
              obj = JSON.parse(code);
            }
            catch (e) {
              console.log(id + "Error parsing " + f + ": " + e)
            }
            var Data = {
              [Name]: Value
            };
            DataObj = {
              ...obj,
              ...Data
            };
            try {
              json = JSON.stringify(DataObj, null, 2);
            }
            catch (e) {
              return cb(e);
            }
            DataObj.id = DataObj.id || uuid.v4();
            fs.writeFile(path.join(dir, DataObj.id + '.json'), json, 'utf8', function(err) {
              if (err) return cb(err);
              cb();
            });
          });
        } else {
          //No exists
            var json;
            obj = {
              id: `${id}`,
              [Name]: "0"
            };
            try {
              json = JSON.stringify(obj, null, 2);
            }
            catch (e) {
              return cb(e);
            }
            obj.id = obj.id || uuid.v4();
            fs.writeFile(path.join(dir, obj.id + '.json'), json, 'utf8', function(err) {
              if (err) return cb(err);
              loadFile(path.join(dir, id + '.json'), Name, cb);
            });
            var Data = {
              [Name]: Value
            };
            DataObj = {
              ...obj,
              ...Data
            };
            try {
              json = JSON.stringify(DataObj, null, 2);
            }
            catch (e) {
              return cb(e);
            }
            DataObj.id = DataObj.id || uuid.v4();
            fs.writeFile(path.join(dir, DataObj.id + '.json'), json, 'utf8', function(err) {
              if (err) return cb(err);
              cb();
            });
          }
        };
      mkdirp(dir, action);
    },


    // delete an object's file

    remove: function(id, cb) {
      var action = function(err) {
        if (err) return cb(err);
        fs.unlink(path.join(dir, id + '.json'), function(err) {
          cb(err);
        });
      }
      mkdirp(dir, action);
    },


    // load an object from file

    load: function(id, Name, cb) {
      mkdirp(dir, function(err) {
        if (err) return cb(err);
        const File = path.join(dir, id + '.json')
        if (fs.existsSync(File)) {
          // path exists
          loadFile(path.join(dir, id + '.json'), Name, cb);
        } else {
            var json;
            var obj = {
              id: `${id}`,
              [Name]: "0"
            };
            try {
              json = JSON.stringify(obj, null, 2);
            }
            catch (e) {
              return cb(e);
            }
            obj.id = obj.id || uuid.v4();
            fs.writeFile(path.join(dir, obj.id + '.json'), json, 'utf8', function(err) {
              if (err) return cb(err);
              loadFile(path.join(dir, id + '.json'), Name, cb);
            });
          };
      })
    }
  }
};

var readdir = function(dir, cb) {
  fs.readdir(dir, function(err, files) {
    if (err) return cb(err);
    files = files.map(function(f) {
      return path.join(dir, f);
    });
    cb(null, files);
  });
};


var loadFile = function(f, Name, cb) {
  fs.readFile(f, 'utf8', function(err, code) {
    if (err) return cb("error loading file" + err);
    try {
      var jsonObj = JSON.parse(code);
      var Value = jsonObj[Name]
      if (Value === undefined) {
        Value = "0"
    } 
    }
    catch (e) {
      cb("Error parsing " + f + ": " + e);
    }
    cb(null, Value);
  });
};

var sort = function(objs, cb) {
  async.sortBy(objs, function(obj, cb) {
    cb(null, obj.name || '');
  }, cb);
};

var Check = function(ObjVar, UserID) {
  if (ObjVar === undefined) {
    const MemberData = {
        id: `${UserID}`,
        [ObjVar]: "0"
      };
      const mergedObject = {
        ...object,
        ...MemberData
      };
      store.add(mergedObject, function(err) {
        if (err) throw err;
    });
}
};