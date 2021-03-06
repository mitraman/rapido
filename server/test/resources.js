var assert = require("assert")
var request = require("superagent")

var token = '';
var sketchId = '555dbb65f929a15d719ec285';

describe('CRUDNodes', function() {
    before(function(done) {
        request
        .post('http://kai:go@localhost:8081/login')
        .end(function(err, res) {
            token = res.body.token;
            done();
        });
    })

    describe('Get All CRUD Nodes', function() {
        it( 'should return a list of CRUD nodes for a particular sketch', function(done) {
            request
            .get('http://localhost:8081/sketches/' + sketchId + '/crudnodes')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert(res.body.result);
                assert.equal(res.body.type, 'crudnode');
                done();
            });
        });
    })

    describe('Create Node', function() {
        it( 'should create a new parent node', function(done) {

            var message = 
            {
                crudnode: {
                    name: "test",
                    description: "testing",
                    url: "/test",
                    methods: ["GET","PUT","POST","DELETE"],
                    statusCode: '200',
                    responses: [{name: "GET", body: "test"}, {name: "POST", body: "test2"}],
                    parent: null,
                    class: 'blah',
                    children: []
                }
            }
            
        request
            .post('http://localhost:8081/sketches/' + sketchId + '/crudnodes')
            .set('Authorization', 'Bearer ' + token)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(message))
            .end(function(err, res) {
                assert.equal(201, res.status);
                assert.equal(res.body.type, 'crudnode');

                // Attempt to create a new child node
                message = 
                    {
                        crudnode: {
                            name: "child-test",
                            description: "testing",
                            url: "/test",
                            methods: ["GET","PUT","POST","DELETE"],
                            statusCode: '200',
                            responses: [{name: "GET", body: "test"}, {name: "POST", body: "test2"}],
                            parent: res.body.result.id,
                            class: 'blah',
                            children: []
                        }
                    }

             request
                .post('http://localhost:8081/sketches/' + sketchId + '/crudnodes')
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(message))
                .end(function(err, res) {
                    assert.equal(201, res.status);
                    assert.equal(res.body.type, 'crudnode');
                    done();
                })
            })
        })
    })

    describe('Update with no body', function() {
        var node;

        before(function(done) { 
         request
            .get('http://localhost:8081/sketches/' + sketchId + '/crudnodes')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert(res.body.result.length > 0 );
                node = res.body.result[0];
                done();
            });

        })

        it( 'should reject an attempt to update a valid node with no message body sent', function(done) {
             request
                .put('http://localhost:8081/crudnodes/' + node.id)
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .end(function(err, res) {
                    assert.equal(500, res.status);
                    done();
                })
        })
    })
    
    describe('Update a non-existent node', function() {
        it( 'should reject an attempt to updated a bad node', function(done)  {

            var node = {};

            request
                .put('http://localhost:8081/crudnodes/bad_id')
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .send(node)
                .end(function(err, res) {
                    console.log(res.body);
                    assert.equal(500, res.status);
                    done();
                })

        })
    })

    describe('Update a node', function() {
        var node;

        before(function(done) { 
         request
            .get('http://localhost:8081/sketches/' + sketchId + '/crudnodes')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                node = res.body.result[0];
                done();
            });

        })
        it( 'should update the response body of an existing node', function(done) {
            var body = { testing: 'test' };
            node.body = JSON.stringify(body);

            var message = { hypernode: node };

            request
                .put('http://localhost:8081/crudnodes/' + node.id)
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(message))
                .end(function(err, res) {
                    assert.equal(204, res.status);
                    done();
                })
        })
        it( 'node properties should be updated', function(done) {
            request
                .get('http://localhost:8081/crudnodes/' + node.id)
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .end(function(err, res) {
                    console.log(res.body);
                    assert.equal(200, res.status);
                    assert(res.body.result);
                    var body = JSON.parse(res.body.result.body);
                    assert.equal(body.testing, 'test');
                    done();
                })
        })
    })

})

