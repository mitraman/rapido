import Base from 'ember-simple-auth/authorizers/base';

const { service } = Ember.inject;

export default Base.extend({
	session: service('session'),

  authorize: function(data, block) {  	
  	var token = data.token;  	

    if (this.get('session.isAuthenticated') && !Ember.isEmpty(token) ){
    	block('Authorization', 'Bearer ' + token);
    }
  }
});
