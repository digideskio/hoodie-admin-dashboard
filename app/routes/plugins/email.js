import Ember from 'ember';

export default Ember.Route.extend({
  // WHYYYYY do I need this?
  controllerName: 'email',
  model: function () {
    return Ember.$.getJSON('/_api/app/config').then(function(data) {
      data.id = data._id;
      // Set model defaults in case the plugin has never run before
      data.config.fromEmail = data.config.fromEmail || '';
      data.config.availableEmailServices = data.config.availableEmailServices || [
        {id: 'Gmail',text: 'Google Mail'},
        {id: 'Mailgun',text: 'Mailgun'},
        {id: 'Mandrill',text: 'Mandrill'},
        {id: 'Postmark',text: 'Postmark'},
        {id: 'SendGrid',text: 'SendGrid'}
      ];
      data.config.emailService = data.config.emailService || '';
      data.config.emailUsername = data.config.emailUsername || '';
      data.config.emailPassword = data.config.emailPassword || '';
      return data.config;
    });
  },
  actions:{
    updateEmailSettings: function () {
      var route = this;
      var controller = route.controller;
      // Fetch the current config state
      window.hoodieAdmin.request('GET', '/app/config')
      .done(function(config){
        var model = {config: route.controller.get('model')};
        // Merge the current config and the model together
        Ember.merge(config, model);
        // Save the new config
        window.hoodieAdmin.request('PUT', '/app/config', {data: JSON.stringify(config)})
        .done(function(){
          controller.set('submitMessage', 'Saved email settings successfully!');
        }).fail(function(error){
          console.log('error: ',error);
          controller.set('submitMessage', 'Error: '+error.status+' - '+error.responseText);
        });
      }).fail(function(error){
        console.log('error: ',error);
      });
      return false;
    }
  }
});
