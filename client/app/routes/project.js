import Ember from 'ember';

export default Ember.Route.extend({
	error(error, transition) {
		console.log('error!');
		console.log(error);
	},
	model: function(params) {		
		return this.store.find('project', params.project_id);
	},
	renderTemplate: function(controller, model) {
		// Render the project menu at the top of the screen
		this.render('project-menu', {
			into: 'application',
			outlet: 'top-nav',
			controller: controller,
			model: model
		})
	},
	actions: {
		goToVocab() {
			this.transitionTo('project.vocabulary');
		},
    	goToSketch() {          		
    		this.transitionTo('project.sketches');
    	}
    }
});
