import Ember from "ember";

export default Ember.Controller.extend({
  needs: ['project', 'project/sketches', 'project/sketches/graph', 'project/sketches/graph/hypernode'],
  sketchController: Ember.computed.alias('controllers.project/sketches/graph'),
  projectController: Ember.computed.alias('controllers.project'),
    
    // General wizard properties and helpers
    init: function() {
        //this.send('resetWizard');
    },

    wizardTitle: 'Add a HAL response',

    // New Resource Wizard Properties
    newNodeName: '',
    newNodeContentType: 'application/hal+json',
    contentTypes: ['application/vnd.collection+json','application/hal+json'],
    knownContentTypeHelp : '',


    // Wizard state variables (used by the template to determine which modal screen to show)

    wizard_root: function() { if(this.get('wizardState') === 'root') { return true; } else { return false; } }.property('wizardState'),
    wizard_start: function() { if(this.get('wizardState') === 'start') { return true; } else { return false; } }.property('wizardState'),
    wizard_createLink: function() { if(this.get('wizardState') === 'createLink') { return true; } else { return false; } }.property('wizardState'),

    wizardState: 'root',
    wizardStackPush: function() { this.get('wizardStack').push(this.get('wizardState')); }.observes('wizardState'),
    wizardStack: [],


    actions: {
        resetWizard: function() {
            // Reset defaults when a new state is selected
            var node = this.get('nodeController').get('model');
            
            // If this is a link for the root node, set the wizardState to root.
            if( !node ) {
                this.set('wizardState', 'root');
            }else {
                this.set('wizardState', 'createLink');
            }
            
            this.set('newNodeName', '');
            this.set('prompt', '');
            this.set('rel', '');
            this.set('url', '');
        },

        createNewNode: function() {

          console.log('createNewNode called');
           // Create a new root collection


           var sketchId = this.get('sketchController').model.id;  
           var contentType = this.get('newNodeContentType');
           var controller = this;

           var url = '$(' + this.get('newNodeName') + ')';

           console.log(this.get('projectController'));
           console.log(sketchId);
           console.log(this.get('sketchController'));
           console.log(url);

           // Create a new node with basic details
           
           var newNode = this.store.createRecord('hypernode', 
                   { sketch: sketchId, 
                     name: this.get('newNodeName'),
                     contentType: this.get('newNodeContentType'),
                     url: url,
                     body: '',
                     method: 'GET' });
           var body = HAL.createBody(newNode);           
           body._links.self = { href: url };
           newNode.set('body', JSON.stringify(body, null, '    '));
           console.log('saving...');
           newNode.save().then(function(savedNode) { 

              console.log('resolved...');
               // Close the modal
               $('#transitionModal').modal('hide');
               
               // Refresh the data model and transition the user back to the graph
               controller.send('modelUpdated');
               controller.transitionToRoute('project.sketch.graph', controller.get('projectController').model.id, sketchId);
           });        
           
       }
    }

    
});


