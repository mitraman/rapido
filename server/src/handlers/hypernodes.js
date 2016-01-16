var mongo = require('mongoskin');
var passport = require('passport');
var representer = require('../representers/json.js')();
var RSVP = require('RSVP');

var objectType = 'hypernode' 

module.exports = function(app, conn) { 

app.get('/sketches/:sketchId/hypernodes', passport.authenticate('bearer', {session: false}), function(req, res) {
    conn.findAll('hypernodes', {sketch: req.params.sketchId}, function(err, responses) {
       if( err ) {
           res.send(500, representer.errorMessage(err));
           return;
       } 
       console.log(responses);
       res.send(200, representer.formatCollection(objectType, responses));
    });
});

app.get('/hypernodes/:hypernodeId', passport.authenticate('bearer', {session: false}), function(req, res) {
    conn.findOne('hypernodes', {id: req.params.hypernodeId}, function(err, result) {
        if( err ) {
           res.send(500, representer.errorMessage(err));
        }else {
           console.log(result);
           res.send(200, representer.formatObject(objectType, result));
        }
    });
});

app.put('/hypernodes/:hypernodeId', passport.authenticate('bearer', {session: false}), function(req, res) {
    var hnode = req.body.hypernode;

    console.log('hypernode UPDATE');

    if( !hnode ) {
        res.send(500, representer.errorMessage('A replacement object was not sent.'));
        return;
    }

     var _node = {
        id: req.params.hypernodeId, 
        sketch: hnode.sketch,
        root: hnode.root || false,
        name: hnode.name,
        nodeClass: hnode.nodeClass,
        url: hnode.url,
        method: hnode.method,
        description: hnode.description,
        contentType: hnode.contentType,
        headers: hnode.headers,
        transitions: hnode.transitions,
        body: hnode.body,
        created: hnode.created,
        x: hnode.x,
        y: hnode.y
    }

    console.log(_node);

    conn.replace('hypernodes', _node, function(err) {
        if( err ) {
            res.send(500, representer.errorMessage(err));
            return;
        }
        res.send(204);
    });

});

/***
Marked for deletion

// Create a collection of nodes at the same time (e.g. multiple methods for a single URL )
// If any of the insertions fail, return a 5xx error.
app.post('/sketches/:sketchId/hypernodes/collection', passport.authenticate('bearer', {session: false}), function(req, res) {

    var nodeCollection = req.body.collection;
    var sketchId = req.params.sketchId;
    var sourceNodeId = req.params.sourceNodeId;

    console.log('collection');
    console.log(nodeCollection);

    // Create an array of nodes to be inserted
    var nodesToCreate = [];
    for( var i = 0; i < nodeCollection.length; i++ ) {

        var hyperNode = nodeCollection[i];

        var _node = {
            sketch: sketchId,
            nodeClass : hyperNode.className ? hyperNode.className : 'node',
            name: hyperNode.name,
            description: hyperNode.description,
            url: hyperNode.url,
            method: hyperNode.method,
            contentType: hyperNode.contentType,
            headers: hyperNode.headers ? hyperNode.headers : [],
            statusCode: hyperNode.statusCode,
            reason: hyperNode.reason,
            tags: hyperNode.tags,
            transitions: [],
            body: hyperNode.body,
            created: new Date(),
        }

        nodesToCreate.push(_node);
    }

    var promises = nodesToCreate.map(function(node){
      return conn.promiseInsert('hypernodes', node);
    });

    console.log(promises);

    RSVP.all(promises).then(function(newNodes) {
      // posts contains an array of results for the given promises
        res.send(201, representer.formatCollection(objectType, newNodes));
    }).catch(function(reason){
      // if any of the promises fails.
        res.send(500, representer.errorMessage('unable to create hypermedia nodes'));

        //TODO: Rollback by deleting the nodes that have been inserted.
    });

});
***/

app.post('/sketches/:sketchId/hypernodes', passport.authenticate('bearer', {session: false}), function(req, res) {

    var hnode = req.body.hypernode;
    var method = hnode.method;
    var description = hnode.description;
    var contentType = hnode.contentType;
    var body = hnode.body;
    var transitions = hnode.transitions;

    var _node = {
        sketch: req.params.sketchId,
        name: hnode.name,
        nodeClass : hnode.nodeClass ? hnode.nodeClass : 'node',
        description: description,
        url: hnode.url,
        method: method,
        contentType: contentType,
        headers: [],
        headers: hnode.headers ? hnode.headers : [],
        statusCode: hnode.statusCode,
        reason: hnode.reason,
        tags: hnode.tags,
        transitions: hnode.transitions ? hnode.transitions : [],
        body: body,
        created: new Date(),
    }

    conn.insert('hypernodes', _node, function(err, id, newHyperNode) {
        if( err ) {
            res.send(500, representer.errorMessage('unable to create hypermedia node'));
        }else {
            res.send(201, representer.formatObject(objectType, newHyperNode));
        }
    });
});
}
