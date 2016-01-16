var assert = require("assert")
var request = require("superagent")

var token = '';

describe('Projects', function() {
    before(function(done) {
        request
        .post('http://kai:go@localhost:8081/login')
        .end(function(err, res) {
            token = res.body.token;
            done();
        });
    })

    describe('Get All Projects', function() {
        it( 'should return a list of projects', function(done) {
            request
            .get('http://localhost:8081/projects')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert.equal(res.body.type, 'project');
                done();
            });
        });
    })

    describe('Get project', function() {
        var projectId = '';

        before(function(done) {
             request
            .get('http://localhost:8081/projects')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert.equal(res.body.type, 'project');
                assert(res.body.result.length > 0 );
                projectId = res.body.result[res.body.result.length-1].id;
                done();
            });
        })

        it( 'should return an individual project', function(done) {
            request
            .get('http://localhost:8081/projects/'+projectId)
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert.equal(res.body.type, 'project');
                done();
            });
        });
    })

    describe('Update project (full replacement)', function() {
        var project;

        before(function(done) {
             request
            .get('http://localhost:8081/projects')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert.equal(res.body.type, 'project');
                assert(res.body.result.length > 0 );
                project = res.body.result[res.body.result.length-1];
                done();
            });
        })


        it( 'should accept an update', function(done) {

            project.name='updated';
            project.simpleVocabulary = ['new word', 'second word'];
            project.descriptoin = 'this resource has been updated';
            
            var body = project;

            request
            .put('http://localhost:8081/projects/'+project.id)
            .set('Authorization', 'Bearer ' + token)
            .send(body)
            .end(function(err, res) {
                assert.equal(204, res.status);
                done();
            });
        });
    })

    describe('Update project with illegal change (full replacement)', function() {
        var project;

        before(function(done) {
             request
            .get('http://localhost:8081/projects')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(200, res.status);
                assert.equal(res.body.type, 'project');
                assert(res.body.result.length > 0 );
                project = res.body.result[res.body.result.length-1];
                done();
            });
        })


        it( 'should reject an illegal update', function(done) {

            project.name='updated';
            project.owner='illegal';
            
            var body = project;

            request
            .put('http://localhost:8081/projects/'+project.id)
            .set('Authorization', 'Bearer ' + token)
            .send(body)
            .end(function(err, res) {
                assert.equal(400, res.status);
                done();
            });
        });
    })



    
    describe('Get projects', function() {
        it( 'should reject an invalid project id', function(done) {
            request
            .get('http://localhost:8081/projects/badid/')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                assert.equal(404, res.status);
                done();
            });
        });
    })

    describe('Create Project', function() {
        it( 'should create a new project', function(done) {
            var body = '{ "project" : { "name": "test", "description": "mocha test", "projectType": "CRUD", "contentType": "application/json" } }';
            request
            .post('http://localhost:8081/projects')
            .set('Authorization', 'Bearer ' + token)
            .set('Content-Type', 'application/json')
            .send(body)
            .end(function(err, res) {
                assert.equal(201, res.status);
                assert.equal(res.body.type, 'project');
                done();
            })
        })
    })
})
