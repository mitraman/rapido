import Ember from "ember";

export default Ember.Controller.extend({
    
    // General wizard properties and helpers
    init: function() {
        //this.send('resetWizard');
    },

    wizardTitle: 'Add a HAL response',


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
        }
    }

    
});


