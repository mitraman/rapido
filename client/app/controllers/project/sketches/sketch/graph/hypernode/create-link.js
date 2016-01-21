import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
    	rootNodeCreated: function(nodeName, contentType, url, body, method, initializer) {
    		console.log('createNode called');    		
    		console.log(this.get('sketch'));
    		console.log(this.get('sketch').model);
    		console.log(this.get('node'));
    		var sketchId = '';
    		var newNode = this.store.createRecord('hypernode', 
                   { sketch: sketchId, 
                     name: nodeName,
                     contentType: contentType,
                     url: url,
                     body: '',
                     method: method });
    		initializer(newNode);                      
    		console.log(newNode);

    		newNode.save().then(function(savedNode) { 
               // Close the modal
               $('#transitionModal').modal('hide');
               
               // Refresh the data model and transition the user back to the graph
               //controller.send('modelUpdated');
               //controller.transitionToRoute('project.sketches.graph', controller.get('projectController').model.id, sketchId);
           });
    	}
    }
});
