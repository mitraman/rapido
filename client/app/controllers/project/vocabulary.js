import Ember from 'ember';

export default Ember.Controller.extend({

	actions: {
		editWord() {
			console.log('editWord');			
		},
		createVocab() {
			console.log('create');
		}
	}

});
