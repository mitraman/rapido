import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		var project = this.modelFor('project');
		var node = this.modelFor('project.sketches.graph.hypernode');
		var sketch = this.modelFor('project.sketches.graph');

		console.log('route');
		console.log(sketch);
        console.log(node);

		return Ember.RSVP.hash({
			project: project,
			wizardComponentName: 'wizards/hal-wizard',
			sketch: sketch,
			node: node	
		})
	},
	setupController: function(controller, models) {
     controller.setProperties(models);
   },
	renderTemplate: function() { 
        // Choose the appropriate link wizard based on the content type
        var project = this.modelFor('project');        
        var contentType = project.get('contentType');
        var renderWizard = '';

        if( contentType === CollectionJSON.contentType ) {
            renderWizard = 'link-wizards.cj';
        } else if ( contentType === HAL.contentType ) { 
            renderWizard = 'link-wizards.hal';
        } else {
        	console.log(contentType);
            throw new Error('Unknown content type');
        }

     

     	/*   
        this.render(renderWizard, {
            into: 'project.sketches.graph',
            outlet: 'modal'
        });
		*/

		this.render('project.sketches.graph.hypernode.create-link', {
			into: 'project.sketches.graph',
			outlet: 'modal'
		});

        Ember.run.scheduleOnce('afterRender', this, function() {
            $('#transitionModal').modal('show');
        });


    }
    
});

