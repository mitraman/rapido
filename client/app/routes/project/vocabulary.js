import Ember from 'ember';

export default Ember.Route.extend({
	afterModel: function(model) {

		console.log('afterModel vocab');
		var project = this.modelFor('project');

		return new Promise(function(resolve, reject) {
			var simpleVocabulary = project.get('simpleVocabulary');

			console.log(project);
			console.log(simpleVocabulary);

			var vocabulary = [];

			for( var i = 0; i < simpleVocabulary.length; i++ ) {
				vocabulary.push({value: simpleVocabulary[i]});
			}

			model.projectVocabulary = vocabulary;
			resolve();
		});
	},
	model: function() {
		var project = this.modelFor('project');
		console.log('vocabulary route');

		return Ember.RSVP.hash({
        	alps: this.store.query('alps', {project: project.id })
        });
	},
	setupController: function(controller, models) {
    	controller.setProperties(models);
	}
});
