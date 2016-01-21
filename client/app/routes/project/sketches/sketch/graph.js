import Ember from 'ember';

export default Ember.Route.extend({	
	model: function(params) {
		var sketch = this.modelFor('project.sketches.sketch');
		return this.store.query('hypernode', {sketch: sketch.get('id')});
	},

	actions: {
		openModal: function(sourceId) {			
			var project = this.modelFor('project');
			var route = 'project.sketches.sketch.graph.hypernode.create-link';
			this.transitionTo(route, sourceId);
		}
	}
});
