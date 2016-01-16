// CRUD Resource API
// TODO: Add authentication and register mock listeners on changes
var mongo = require('mongoskin');
var passport = require('passport');
var representer = require('../representers/json.js')();

var objectType = 'crudnode' 

module.exports = function(app, conn){

	// Retrieve list of resources
    app.get('/sketches/:sketchId/crudnodes', function(req, res){
		
		var projectId = req.params.projectId;
        conn.findAll('crudnodes', {sketch: req.params.sketchId}, function(err, responses) {
           if( err ) {
               res.send(500, representer.errorMessage(err));
               return;
           } 
           console.log(responses);
           res.send(200, representer.formatCollection(objectType, responses));
        });
	 });
	
	// Create a new resource
    app.post('/sketches/:sketchId/crudnodes', passport.authenticate('bearer', {session: false}), function(req, res) {

		// Store a newly created task object		
		var cnode = req.body.crudnode;

        if( !cnode ) {
            res.send(500, representer.errorMessage('unable to find crudnode property in request body'));
        }

		var _node = {
			name: cnode.name,
			description: cnode.description,
			responses: cnode.responses,
			url: cnode.url,
			children: cnode.children,
			parent: cnode.parent,
			methods: cnode.methods,
            class: cnode.class,
			sketch: req.params.sketchId,
            created: new Date(),
		}

        console.log(cnode);
        
        conn.insert('crudnodes', _node, function(err, id, newCRUDNode) {
            if( err ) {
                res.send(500, representer.errorMessage('unable to create CRUD node'));
            }else {
				// if necessary, update the resource parent's children property
                if( !newCRUDNode.parent ) {
                    res.send(201, representer.formatObject(objectType, newCRUDNode));
                }else {
                    
                    var parentId = mongo.helper.toObjectID(newCRUDNode.parent);
					var crudNodeId = newCRUDNode._id.toString();
                    conn.update('crudnodes', parentId, {'$push': { children: crudNodeId} }, function( err ) {
                        if( err ) {
                            res.send(500, representer.errorMessage('unable to create CRUD node'));
                        }else {
                            res.send(201, representer.formatObject(objectType, newCRUDNode));
                        }
                    })
                        

                }
            }
        });
						
	});
	
	// Replace an existing resource
	app.put('/projects/:projectId/resources/:resourceId', function(req,res) {
		// Store a newly created task object		
		var _resource = req.body.resource;
		var id = req.params.resourceId;
						
		var resource = {
			name: _resource.name,
			description: _resource.description,
			responses: _resource.responses,
			url: _resource.url,
			children: _resource.children,
			parent: _resource.parent,
			methods: _resource.methods,
            class: _resource.class,
			project: req.params.projectId
		}
		
		conn.collection('resources').updateById(mongo.helper.toObjectID(id), resource, function (err, result) {
			if( err ) {
				res.status(500);
				res.send('{"message" : "Unable to store data in database."}');
				console.log(err);
			}else {						
				res.send(200, result);
			}        	        
    	});		
	});

	app.delete('/projects/:projectId/resources/:resourceId', function(req,res) {
		var id = req.params.resourceId;
		
		conn.collection('resources').removeById(mongo.helper.toObjectID(id), function (err, result) {
			if( err ) {
				res.status(500);
				res.send('{"message" : "Unable to store data in database."}');
				console.log(err);
			}else {						
				res.send(200, result);
			}        	        
		});
	});
	
	//TODO: I ran out of time trying to get atomic response manipulation working.  I'll just deal with it at the resources level instead.
	
	
	/**
	// Create a new response for a particular resource
	app.post('/projects/:projectId/resources/:resourceId/responses', function(req,res) {
		var projectId = req.params.projectId;
		var resourceId = req.params.resourceId;

		var _response = req.body.response;

		var response = {
			name: "",
			status: "200",
			headers: {},
			conditions : _response.conditions,
			body: _response.body,
			resource: resourceId,
			project: projectId
		}
		
		console.log(response);
		
		
		conn.collection('responses').insert(response, function (err, result) {
			if( err ) {
				res.send(500, err);
			}else {
				res.send(result);
			}
		})
	});
	**/
	
	/*
	// Upsert a response 
	app.put('/projects/:projectId/resources/:resourceId/responses/:name', function(req,res) {
		var projectId = req.params.projectId;
		var resourceId = req.params.resourceId;
		var responseName = req.params.name;
		
		//db.resources.update({_id: ObjectId("54426195293ae6d92f000002")}, {$set: { "responses.second": {'name': 'second'} } } )
		
		//TODO: This is a security problem.  We should blacklist this field.
		var responseSelector = "responses." + responseName;
		
		conn.collection('resources').updateById(conn.ObjectID.createFromHexString(resourceId), 
												{$set: { 'responses.' + responseName: {'name': responseName} } },
												function (err, result) {
													if(err) res.send(500,err);
													else res.send(result);
												});
	});
			
		
	// Delete an existing response
	app.delete('/projects/:projectId/resources/:resourceId/responses/:name', function(req,res) {
	});
		
		*/
}
