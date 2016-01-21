import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		var project = this.modelFor('project');
		return this.store.findRecord('sketch', params.sketch_id);			
	}
});
