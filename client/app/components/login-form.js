import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
	session: service('session'),
	actions : {
		authenticate() {
			// Retrieve values from form
			let { identification, password } = this.getProperties('identification', 'password');
			this.get('session').authenticate('authenticator:rapido', identification, password)
		}		
	}
});
