import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('logout');
  this.route('plugins', { path: '/plugins'}, function(){
    this.route('plugin', { path: ':plugin_id'});
  });
});

export default Router;
