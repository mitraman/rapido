import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		return Ember.RSVP.hash({
			projects: this.store.findAll('project'),
			projectTypes: [{name:"CRUD", value:"CRUD"},{name:"Hypermedia", value:"Hypermedia"}],
			mediaTypes: [
				{category: "CRUD", types: [{name: "JSON", value: "application/json"}]},
				{category: "Hypermedia", types: [
					{name: "HAL", value: HAL.contentType},
					{name: "Collection JSON", value: CollectionJSON.contentType}]}
			]
		});
	},
	setupController: function(controller, models) {	  
    	controller.setProperties(models);
   	}
});
