var mongo = require('mongoskin');
var passport = require('passport');
var alps = require('../alps/alps.js');
var sketches = require('./sketches.js');
var jsonRepresenter = require('../representers/json.js');

var representer = jsonRepresenter();
var objectType = 'project';

module.exports = function(app, conn, authorizeUser){

// Retrieve a list of authorized projects for this user
app.get('/projects', passport.authenticate('bearer', {session: false}), function(req, res) {
    conn.findAll('projects', {owner: req.user}, function(err, projects) {
       if( err ) {
           res.send(500, representer.errorMessage(err));
           return;
       } 
       res.send(200, representer.formatCollection(objectType, projects));
    });
});

app.get('/projects/:projectId', passport.authenticate('bearer', {session: false}), function(req, res) {

    conn.findOne('projects', {owner: req.user, id: req.params.projectId }, function(err, project ) {
        if( !project ) {
            res.send(404, representer.errorMessage('project not found'));
            return;
        }
        res.send(200, representer.formatObject(objectType, project));
    });
});

// Create a new project
app.post('/projects', passport.authenticate('bearer', {session: false}), function(req, res) {

    var project = req.body.project;
	var name = project.name;
	var description = project.description;
	var hostname = project.hostname;
    var contentType = project.contentType;
	var projectType = project.projectType;

	var project = {
			name : name,
			description : description,
			hostname : hostname,
			projectType: projectType,
            contentType: contentType,
			owner : req.user,
			created : new Date(),
            simpleVocabulary: [],
            activeSketch: '',
            alps: [],
            sketchThumbnails: []
	}


    //Validate fields before creating project
    if( !project.name ) {
        res.send(400, representer.errorMessage('project must have a name')); return;
    }
    if( !project.projectType ) {
        project.projectType = 'CRUD';
    }
    if( !project.contentType ) {
        project.contentType = 'application/json';
    }
    if( !project.description ) {
        project.description = '';
    }
    

    //TODO: implement RSVP so that the conn becomes thenable

    conn.insert('projects', project, function(err, projectId, newProject) {
        if( err ) {
            res.send(500, representer.errorMessage('unable to create new project'));
            return;
        }

        var initialSketch = {
            contentType: newProject.contentType,
            name: 'Initial Sketch',
            description: '',
            responses: [],
            thumbnail: '',
            project: projectId,
            owner: req.user,
            created: new Date()
        }

        // Automatically create an initial sketch and an initial response message state
        conn.insert('sketches', initialSketch, function(err, sketchId, newSketch) {
            if( err ) {
                res.send(500, representer.errorMessage('unable to create new project'));
                return;
            }

            // Update the project with this sketch ID as the activeSketch
            conn.update('projects', projectId, {$set: { activeSketch: newSketch._id}, }, function(err ) {
                //console.log('updating activeSketch ' + sketchId );
                if( !err ) {
                    newProject.activeSketch = newSketch._id;
                    res.send(201, representer.formatObject(objectType, newProject));
                } else {
                    // This isn't a fatal error because the server was able to create the project and the sketch.
                    // The app will have 
                    console.log.warn('unable to set activeSketch id');
                    res.send(201, representer.formatObject(objectType, newProject));
                }
            
            });


        });



    });
			
});

app.put('/projects/:projectId', passport.authenticate('bearer', {session: false}), function(req, res) {
    var projectId = req.params.projectId;

    var project = req.body;
	var name = project.name;
	var description = project.description;
	var hostname = project.hostname;
    var contentType = project.contentType;
	var projectType = project.projectType;

    if( !project.owner ) {
        project.owner = req.user;
    }

    if( project.owner != req.user ) {
        res.send(400, representer.errorMessage('Illegal owner assignment, owner should be ' + req.user));
        return;
    }
    
    conn.findOne('projects', {owner: req.user, id: req.params.projectId }, function(err, _project ) {
        if( err ) {
            res.send(500, representer.errorMessage('unable to update project resource'));
            return;
        }
        if( !_project ) {
            res.send(404, representer.errorMessage('project not found'));
            return;
        }

        	var updatedProject = {
                id: projectId,
                name : name,
                description : description,
                hostname : hostname,
                projectType: projectType,
                contentType: contentType,
                owner : req.user,
                created : _project.created,
                simpleVocabulary: project.simpleVocabulary,
                activeSketch: project.activeSketch, 
                alps: project.alps,
                sketchThumbnails: project.sketchThumbnails
            }

            conn.replace('projects', updatedProject, function(err ) {
                if( err ) {
                    res.send(500, representer.errorMessage('Unable to update project resource'));
                }
                res.send(204);
            });
    });
});

app.patch('/projects/:projectId', function(req,res) {
    var projectId = req.params.projectId;

    // Do partial replace by default.
    // TODO: support other attributes
    var vocabulary = req.body.simpleVocabulary;
    var name = req.body.name;
    var description = req.body.description;
    var projectType = req.body.projectType;
    var contentType = req.body.contentType;
    var templates = req.body.templates;

    console.log(name);
    console.log(req.body);

    var updatedContent = {};
    if( vocabulary ) { updatedContent.simpleVocabulary = vocabulary; }
    if( name ) { updatedContent.name = name; }
    if( description ) { updatedContent.description = description; }
    if( projectType ) { updatedContent.projectType = projectType; }
    if( contentType ) { updatedContent.contentType = contentType; }
    if( templates ) { updatedContent.templates = templates; }
    console.log(updatedContent);

    //TODO: Needs to be updated!

    /**

	conn.collection('projects').update(
		{_id: mongo.helper.toObjectID(projectId)}, 
		{'$set': updatedContent },
		function(err, post) {
			if( !err ) {
				res.send(200);
			} else {
                res.send(500, representer.errorMessage(err));
			}
	});

    **/
});

// Add an ALPS document to the project
//TODO: Update
app.post('/projects/:projectId/alps', function(req,res) {
	var projectId = req.params.projectId;
	// get ALPS document from JSON body
	var alpsDoc = req.body.alps;
    var name = alpsDoc.name;
    var doc = alpsDoc.doc;

    alps('xml', doc, function(error, parsedAlps) {
        if( error ) {
                res.send(400, 'unable to parse alps document');
        }
        var alpsVocab = {
                name: name,
                words: Object.keys(parsedAlps),
                body: doc
        }

        conn.collection('projects').updateById(mongo.helper.toObjectID(projectId), 
            {'$push': {alps: alpsVocab}},
		    function(err, post) {
                if( err ) {
                    console.log(err);
                    res.send(400);
                }else {
                    console.log(post);
                    res.send(200);
                }
            }
        );
    });
});

// Update the simple vocabulary of a project
app.put('/projects/:projectId/vocabulary', function(req, res) {	
	var projectId = req.params.projectId;
	// get vocab list from JSON body
	var vocabulary = req.body.vocabulary;
	
	conn.collection('projects').update(
		{_id: conn.ObjectID.createFromHexString(projectId)}, 
		{'$set': {'simpleVocabulary': vocabulary}},
		function(err, post) {
			if( !err ) {
				res.send(200);
			} else {
				res.send(500, err);
			}
	});
    	
});

// Delete a project
app.delete('/projects/:projectId', passport.authenticate('bearer', {session: false}), authorizeUser, function(req, res) {
	var projectId = req.params.projectId;
	
	//TODO: implement this.
	// Remove the resources/states/nodes/tasks whatever we are calling them now
	
	
});

}
