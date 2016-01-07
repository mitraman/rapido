import Ember from 'ember';

export default Ember.Component.extend({

	actions: {
		goToVocab() {
			var project = this.get('content');  
          	this.transitionToRoute('project.vocabulary', project.get('id'));
		},
		goToSketch() {

		},
		goToExport() {

		}
	}
});
