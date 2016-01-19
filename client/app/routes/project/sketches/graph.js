import Ember from 'ember';

export default Ember.Route.extend({

	model: function(params) {		
		return this.store.find('hypernode', {sketch: params.sketch_id});
	},

	actions: {
		openModal: function(sourceId) {
			console.log('openModal');
			console.log(sourceId);

			var project = this.modelFor('project');

			var route = 'project.sketches.graph.hypernode.create-link';
			this.transitionTo(route, sourceId);
		}
	}
});
