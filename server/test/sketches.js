var assert = require("assert")
var request = require("superagent")

var token = '';
var objectType = 'sketch';
var projectId = '557a8f26817d777c13d131aa';

describe('Sketches', function() {
    before(function(done) {
        request
        .post('http://kai:go@localhost:8081/login')
        .end(function(err, res) {
            token = res.body.token;
            done();
        });
    })

    describe('Get all sketches for a project', function() {
        it( 'should return a list of sketches', function(done) {
            request
            .get('http://localhost:8081/projects/' + projectId + '/sketches')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert.equal(res.body.type, objectType);
                done();
            });
        });
    })

    describe('Get a single sketch', function() {
        var sketchId = '';

        before(function(done) {
        request
            .get('http://localhost:8081/projects/' + projectId + '/sketches')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert.equal(res.body.type, objectType);
                assert(res.body.result.length > 0 );
                sketchId = res.body.result[res.body.result.length-1].id;
                done();
            });
        })

        it( 'should return a sketch', function(done) {
            request
            .get('http://localhost:8081/sketches/' + sketchId)
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert.equal(res.body.type, objectType);
                console.log(res.body);
                done();
            });
        });
    })


    describe('Create Sketch', function() {
        it( 'should create a new sketch', function(done) {
            var message = {
                sketch: {
                    name: 'mocha test',
                    description: 'testing',
                }
            };

            request
            .post('http://localhost:8081/projects/' + projectId + '/sketches')
            .set('Authorization', 'Bearer ' + token)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(message))
            .end(function(err, res) {
                assert.equal(201, res.status);
                assert.equal(res.body.type, objectType);
                done();
            })
        })
    })
})

