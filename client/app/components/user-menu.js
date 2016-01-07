import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
	session: service('session'),

	actions: {
		signOut() {			
			this.get('session').invalidate();			
		} 
	}
});
