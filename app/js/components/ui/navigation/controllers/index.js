'use strict';

var app = require('../../../../helpers/namespace');
var Marionette = require('backbone.marionette');
var View = require('../views/index');

var Controller = Marionette.Controller.extend({

  initialize: function (options) {
    this.options = options || {};
  },

  show: function (opts) {
    var view = new View({
      collection: opts.collection,
      model: opts.model,
      ns: opts.ns
    });

    app.rm.get('sidebar_nav').show(view);
  }

});

module.exports = Controller;