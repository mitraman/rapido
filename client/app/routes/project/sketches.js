import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		var project = this.modelFor('project');		

		// TODO: In future, render the list of sketches allowing the user to choose one

		// Get the last sketch that was being used or the first sketch
		var activeSketch = project.get('activeSketch');		

		if( project.get('projectType') === 'CRUD' )  {
            this.transitionTo('project.sketches.tree', activeSketch);
        }else {         
            this.transitionTo('project.sketches.sketch.graph', activeSketch);
        }
	}
});
