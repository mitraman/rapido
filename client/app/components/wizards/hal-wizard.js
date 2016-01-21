import Ember from 'ember';

export default Ember.Component.extend({

	// General wizard properties and helpers
	didInsertElement() {		
		this.send('resetWizard');
	},
        

    // New Resource Wizard Properties
    newNodeName: '',
    newNodeContentType: 'application/hal+json',
    
    newNodeURI : function() {
        var name = this.get('newNodeName');
        if( name.length > 0 ) {
            return '$(' + name + ')';
        }
        return '';
    }.property('newNodeName'),


    actions: {
        resetWizard: function() {
            this.set('newNodeName', '');
        },

        createNewNode: function() {
          console.log('createNewNode called');
          
          // Create a new node with basic details
          //var body = bodyGenerator(newNode);
          //body._links.self = { href: url };
          //newNode.set('body', JSON.stringify(body, null, '    '));

           this.get('onCreateNode')(
           	this.get('newNodeName'), 
           	this.get('newNodeContentType'), 
           	this.get('newNodeURI'), 
           	'', 
           	'GET', 
           	function(newNode) {
           		console.log('inside initializer')
           		var body = HAL.createBody(newNode);
           		body._links.self = { href: newNode.get('url') };
           		newNode.set('body', JSON.stringify(body, null, '    '));
           	});

       	}
    }

});
