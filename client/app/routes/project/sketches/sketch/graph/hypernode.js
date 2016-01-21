import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
        console.log('model hypernode');
        var nodeId = params.node_id;
		var sketchModel = this.modelFor('project.sketches.graph');
        var nodes = sketchModel.get('content');

        console.log('trying to find the node...');
        console.log(nodes);
        console.log(nodeId);

        return null;

        if( nodeId === 'root' ) {
            return null;
        }else {
            for( var i=0; i < nodes.length; i++ ) {
                if( nodes[i].get('id') === nodeId ) { 
                    return nodes[i];
                }
            }
        }
	}
});
