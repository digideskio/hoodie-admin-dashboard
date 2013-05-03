// Generated by CoffeeScript 1.5.0
var HoodieAdmin,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

HoodieAdmin = (function(_super) {

  __extends(HoodieAdmin, _super);

  function HoodieAdmin(baseUrl) {
    this.baseUrl = baseUrl;
    if (this.baseUrl) {
      this.baseUrl = this.baseUrl.replace(/\/+$/, '');
    } else {
      this.baseUrl = "/_api";
    }
    this.account = new HoodieAdmin.Account(this);
    this.app = new HoodieAdmin.App(this);
    this.users = new HoodieAdmin.Users(this);
    this.config = new HoodieAdmin.Config(this);
    this.logs = new HoodieAdmin.Logs(this);
    this.modules = new HoodieAdmin.Modules(this);
  }

  HoodieAdmin.prototype.trigger = function() {
    var event, parameters;
    event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return HoodieAdmin.__super__.trigger.apply(this, ["admin:" + event].concat(__slice.call(parameters)));
  };

  HoodieAdmin.prototype.on = function(event, data) {
    event = event.replace(/(^| )([^ ]+)/g, "$1admin:$2");
    return HoodieAdmin.__super__.on.call(this, event, data);
  };

  HoodieAdmin.prototype.request = function(type, path, options) {
    var defaults;
    if (options == null) {
      options = {};
    }
    defaults = {
      type: type,
      url: "" + this.baseUrl + path,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      dataType: 'json'
    };
    return $.ajax($.extend(defaults, options));
  };

  HoodieAdmin.prototype.open = function(storeName, options) {
    if (options == null) {
      options = {};
    }
    $.extend(options, {
      name: storeName
    });
    if (this.baseUrl !== this.baseUrl) {
      options.baseUrl = this.baseUrl;
    }
    return new Hoodie.Remote(this, options);
  };

  HoodieAdmin.prototype.authenticate = function() {
    return this.account.authenticate();
  };

  HoodieAdmin.prototype.signIn = function(password) {
    return this.account.signIn(password);
  };

  HoodieAdmin.prototype.signOut = function() {
    return this.account.signOut();
  };

  return HoodieAdmin;

})(Hoodie);

Hoodie.extend('admin', HoodieAdmin);

HoodieAdmin.Account = (function(_super) {

  __extends(Account, _super);

  function Account(hoodie) {
    var method, noop, _i, _len, _ref;
    this.hoodie = hoodie;
    this._handleSignInSuccess = __bind(this._handleSignInSuccess, this);
    this._handleAuthenticateRequestSuccess = __bind(this._handleAuthenticateRequestSuccess, this);
    this.username = 'admin';
    this._requests = {};
    noop = function() {};
    _ref = ['signUp', 'destroy', 'anonymousSignUp', 'hasAnonymousAccount', 'setAnonymousPassword', 'getAnonymousPassword', 'removeAnonymousPassword', 'resetPassword', '_checkPasswordResetStatus'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      method = _ref[_i];
      this[method] = noop;
    }
    Account.__super__.constructor.apply(this, arguments);
  }

  Account.prototype.on = function(event, cb) {
    event = event.replace(/(^| )([^ ]+)/g, "$1account:$2");
    return this.hoodie.on(event, cb);
  };

  Account.prototype.trigger = function() {
    var event, parameters, _ref;
    event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = this.hoodie).trigger.apply(_ref, ["account:" + event].concat(__slice.call(parameters)));
  };

  Account.prototype.request = function(type, path, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    return (_ref = this.hoodie).request.apply(_ref, arguments);
  };

  Account.prototype.signIn = function(password) {
    var username;
    username = 'admin';
    return this._sendSignInRequest(username, password);
  };

  Account.prototype.signOut = function(password) {
    var _this = this;
    return this._sendSignOutRequest().then(function() {
      return _this.trigger('signout');
    });
  };

  Account.prototype._handleAuthenticateRequestSuccess = function(response) {
    if (response.userCtx.name === 'admin') {
      this._authenticated = true;
      this.trigger('authenticated', this.username);
      return this.hoodie.resolveWith(this.hoodie);
    } else {
      this._authenticated = false;
      this.trigger('error:unauthenticated');
      return this.hoodie.rejectWith();
    }
  };

  Account.prototype._handleSignInSuccess = function(options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    return function(response) {
      _this.trigger('signin', _this.username);
      _this.trigger('authenticated', _this.username);
      return _this.hoodie.resolveWith(_this.hoodie);
    };
  };

  Account.prototype._userKey = function() {
    return 'admin';
  };

  return Account;

})(Hoodie.Account);

HoodieAdmin.App = (function() {

  function App(hoodie) {
    this.hoodie = hoodie;
  }

  App.prototype.getInfo = function() {
    var defer, info;
    defer = this.hoodie.defer();
    info = {
      name: "appName here"
    };
    window.setTimeout(function() {
      return defer.resolve(info);
    });
    return defer.promise();
  };

  App.prototype.getStats = function(since) {
    var defer, key, stats;
    defer = this.hoodie.defer();
    stats = {
      signups: 12,
      account_deletions: 3,
      users_active: 1302,
      users_total: 4211,
      growth: 0.04,
      active: -0.02,
      since: since
    };
    if (!since) {
      for (key in stats) {
        stats[key] = stats[key] * 17;
      }
    }
    window.setTimeout(function() {
      return defer.resolve(stats);
    });
    return defer.promise();
  };

  return App;

})();

HoodieAdmin.Config = (function() {

  function Config(hoodie) {
    this.hoodie = hoodie;
  }

  Config.prototype.get = function() {
    return this.hoodie.modules.find("appconfig").pipe(function(module) {
      return module.config;
    });
  };

  Config.prototype.set = function(config) {
    if (config == null) {
      config = {};
    }
    return this.hoodie.modules.update("appconfig", {
      config: config
    });
  };

  return Config;

})();

HoodieAdmin.Logs = (function() {

  function Logs(hoodie) {
    this.hoodie = hoodie;
  }

  Logs.prototype.findAll = function() {
    return this.hoodie.resolveWith([]);
  };

  return Logs;

})();

HoodieAdmin.Modules = (function(_super) {

  __extends(Modules, _super);

  Modules.prototype.name = 'modules';

  function Modules(hoodie) {
    this.hoodie = hoodie;
    this.findAll = __bind(this.findAll, this);
    this.find = __bind(this.find, this);
    Modules.__super__.constructor.call(this, this.hoodie);
  }

  Modules.prototype.find = function(type, moduleName) {
    if (!moduleName) {
      moduleName = type;
    }
    return Modules.__super__.find.call(this, "module", moduleName);
  };

  Modules.prototype.findAll = function() {
    return Modules.__super__.findAll.call(this, 'module');
  };

  Modules.prototype.update = function(moduleName, config) {
    return Modules.__super__.update.call(this, "module", moduleName, config);
  };

  Modules.prototype.getConfig = function(moduleName) {
    return this.hoodie.resolveWith({
      email: {
        transport: {
          host: "",
          port: 465,
          auth: {
            user: "@gmail.com",
            pass: ""
          },
          secureConnection: true,
          service: "Gmail"
        }
      }
    });
  };

  Modules.prototype.setConfig = function(moduleName, config) {
    if (config == null) {
      config = {};
    }
    return this.hoodie.resolveWith(config);
  };

  Modules.prototype.request = function(type, path, options) {
    if (options == null) {
      options = {};
    }
    if (this.name) {
      path = "/" + (encodeURIComponent(this.name)) + path;
    }
    options.contentType || (options.contentType = 'application/json');
    if (type === 'POST' || type === 'PUT') {
      options.dataType || (options.dataType = 'json');
      options.processData || (options.processData = false);
      options.data = JSON.stringify(options.data);
    }
    return this.hoodie.request(type, path, options);
  };

  return Modules;

})(Hoodie.Remote);

HoodieAdmin.Users = (function(_super) {

  __extends(Users, _super);

  Users.prototype.name = '_users';

  Users.prototype.prefix = 'org.couchdb.user:';

  function Users(hoodie) {
    this.hoodie = hoodie;
    this._mapDocsFromFindAll = __bind(this._mapDocsFromFindAll, this);
    Users.__super__.constructor.call(this, this.hoodie);
  }

  Users.prototype.addTestUser = function(options) {
    var email, hash;
    if (options == null) {
      options = {};
    }
    hash = "test" + (this.hoodie.uuid(5));
    email = "" + hash + "@example.com";
    return this._signUpUser(hash, email);
  };

  Users.prototype.addTestUsers = function(nr) {
    var i, promises, timestamp,
      _this = this;
    if (nr == null) {
      nr = 1;
    }
    timestamp = (new Date).getTime();
    if (nr > 10) {
      this.addTestUsers(10).then(function() {
        nr -= 10;
        return _this.addTestUsers(nr);
      });
    } else {
      promises = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; 1 <= nr ? _i <= nr : _i >= nr; i = 1 <= nr ? ++_i : --_i) {
          _results.push(this.addTestUser());
        }
        return _results;
      }).call(this);
    }
    return $.when.apply($, promises);
  };

  Users.prototype.getTestUser = function() {
    return this.hoodie.rejectWith({
      error: "deprecated"
    });
  };

  Users.prototype.removeAllTestUsers = function() {
    return this.hoodie.rejectWith({
      error: "deprecated"
    });
  };

  Users.prototype.getTotal = function() {
    return this.findAll().pipe(function(users) {
      return users.length;
    });
  };

  Users.prototype.search = function(query) {
    var path;
    path = "/_all_docs?include_docs=true";
    path = "" + path + "&startkey=\"org.couchdb.user:user/" + query + "\"&endkey=\"org.couchdb.user:user/" + query + "|\"";
    return this.request("GET", path).pipe(this._mapDocsFromFindAll).pipe(this._parseAllFromRemote);
  };

  Users.prototype.request = function(type, path, options) {
    if (options == null) {
      options = {};
    }
    if (this.name) {
      path = "/" + (encodeURIComponent(this.name)) + path;
    }
    options.contentType || (options.contentType = 'application/json');
    if (type === 'POST' || type === 'PUT') {
      options.dataType || (options.dataType = 'json');
      options.processData || (options.processData = false);
      options.data = JSON.stringify(options.data);
    }
    return this.hoodie.request(type, path, options);
  };

  Users.prototype._mapDocsFromFindAll = function(response) {
    var rows;
    rows = response.rows.filter(function(row) {
      return /^org\.couchdb\.user:/.test(row.id);
    });
    return rows.map(function(row) {
      return row.doc;
    });
  };

  Users.prototype._signUpUser = function(ownerHash, username, password) {
    var db, id, key, now, options, url;
    if (password == null) {
      password = '';
    }
    if (!username) {
      return this.hoodie.rejectWith({
        error: 'username must be set'
      });
    }
    key = "user/" + username;
    db = "user/" + ownerHash;
    now = new Date;
    id = "org.couchdb.user:" + key;
    url = "/" + (encodeURIComponent(id));
    options = {
      data: {
        _id: id,
        name: key,
        type: 'user',
        roles: [],
        password: password,
        ownerHash: ownerHash,
        database: db,
        updatedAt: now,
        createdAt: now,
        signedUpAt: now
      }
    };
    return this.request('PUT', url, options);
  };

  return Users;

})(Hoodie.Remote);
