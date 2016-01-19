import DS from "ember-data";
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from "../config/environment";

var host = ENV.backend;
var url;
var record;

const { service } = Ember.inject;


/**
 * Creates objects on the server
 * @token {string} ???
 * @url {string} full resource path
 */
function createObject(token, url, data, callback) {
    var createAJAX = $.ajax({
        url: url,
        type: 'POST',
        contentType : 'application/json',
        headers: { Authorization: token },
        data: JSON.stringify(data)
    });

    createAJAX.done( function( response, textStatus, jqXHR ) {
        // On success, create a new model instance and return it
        callback(null, response);
    });

    createAJAX.fail( function( response, textStatus, jqXHR ) {
        callback(textStatus);
    });
}

/**
 * Retrieves objects from the server
 * @url {string} full resource path
 * @return {Promise} promise
 */

function getObjects(token, url, callback) {

    console.log('getObjects');

    var getAJAX = $.ajax({
        url: url,
        type: 'GET',
        headers: { Authorization: token }
    });

    getAJAX.done( function( data, textStatus, jqXHR ) {
        console.log(data);
        	callback(null,data);
    });

    getAJAX.fail( function( data, textStatus, jqXHR ) {
    	console.log('call failed');
    	console.log(textStatus);
    	console.log(jqXHR);
    	console.log(data);
        callback(textStatus, null);
    });

}

/**
 * Updates an object on the server
 * @token {string} ???
 * @url {string} full resource path
 */
function updateObject(token, url, data, callback) {
    var createAJAX = $.ajax({
        url: url,
        type: 'PUT',
        contentType : 'application/json',
        headers: { Authorization: token },
        data: JSON.stringify(data)
    });

    createAJAX.done( function( response, textStatus, jqXHR ) {
        // On success, create a new model instance and return it
        callback(null, response);
    });

    createAJAX.fail( function( response, textStatus, jqXHR ) {
        callback(textStatus);
    });
}

/**
 * Deletes objects from the server
 * @token {string} ???
 * @url {string} full resource path
 *
 * @return {Promise} promise
 */

function deleteObject(token, url, callback) {
    var getAJAX = $.ajax({
        url: url,
        headers: { Authorization: token },
        type: 'DELETE'
    });

    getAJAX.done( function( data, textStatus, jqXHR ) {
        callback(null);
    });

    getAJAX.fail( function( data, textStatus, jqXHR ) {
        console.log('fail');
        callback(textStatus);
    });
}


/* The custom Ember-Data Adapter.
 * Connects with my custom backend.
 */
export default DS.Adapter.extend(DataAdapterMixin, {
    session: service('session'),
    authorizer: 'authorizer:rapido',
    findRecord: function(store, type, id, snapshot ) {

    	url = host;
        var session = this.get('session');

        return new Promise(function(resolve,reject) {
            if( type.modelName === 'project' ) {
                url = url + '/projects/' + id;
            }else if( type.modelName === 'sketch' ) {
                url = url + '/sketches/' + id;
            }else if( type.modelName === 'alps' ){
                url = url + '/alps/' + id;
            }else if( type.modelName === 'hypernode' ){
                url = url + '/hypernodes/' + id;
            }else {
				reject('find is not supported for record type ' + type);
			}

            session.authorize('authorizer:rapido', (headerName, headerValue) => {
                getObjects(headerValue, url, function(error, result) {
    				if( !error  ) {
                        resolve(result.result);
                    } else {
                        reject(error);
                    }
    			});
            });
        });
    },
	findAll: function(store, type, sinceToken) {
		url = host;
        var session = this.get('session');

		return new Promise(function(resolve,reject) {
			if( type.modelName === 'project' ) {
				console.log('findAll project');
				url = url + '/projects';
			}else if( type.modelName === 'alps' ) {
                url = url + '/alps';
            }else {
				reject('findAll is not supported for this record type.');
			}

            session.authorize('authorizer:rapido', (headerName, headerValue) => {
    			getObjects(headerValue, url, function(error, result) {
                    console.log(result);
    				if( error === null ) { resolve(result); }
    				else { reject(error); }
    			});
            });
		});

	},
	query: function(store, type, query, recordArray) {
		url = host;
        var session = this.get('session');

console.log(type.modelName);
        if( type.modelName === 'project') {
			var projectId = query.project;
            url = url + '/projects/' + projectId;
        } else if( type.modelName === 'sketch' ) {
			var projectId = query.project;
            url = url + '/projects/' + projectId + '/sketches';
        } else if( type.modelName === 'alps') {
			var projectId = query.project;
			url = url + '/alps?projectId='+projectId;
        } else if( type.modelName === 'crudnode') {
            url = url + '/sketches/' + query.sketch + '/crudnodes';
		} else if ( type.modelName === 'hypernode' ) {
            url = url + '/sketches/' + query.sketch + '/hypernodes';
		} else if ( type.modelName === 'map' ) {
            var projectId = query.project;
            url = url + '/projects/' + projectId + '/maps';
        } else {
			console.error('findQuery is not supported for this record type.');
		}


		return new Promise(function(resolve,reject) {
            session.authorize('authorizer:rapido', (headerName, headerValue) => {
    			getObjects(headerValue, url, function(error, result) {
                    if( error ) {
                        reject(error);
                    }else {
                        console.log(result);
                        resolve(result.result);
                    }
    			});
            });
		});
	},
	createRecord: function(store, type, record) {
		url = host;
        let session = this.get('session');
		var _record;

		return new Promise(function(resolve,reject) {

			if( type.modelName === 'project' ) {
					_record = {
                        project: {
                            name: record.attr('name'),
                            description: record.attr('description'),
                            hostname: record.attr('hostname'),
                            contentType: record.attr('contentType'),
                            projectType: record.attr('projectType'),
                            activeSketch: record.attr('activeSketch')
                        }
					};
					url = url + '/projects';
			} else if( type.modelName === 'sketch' ) {
                var _record = { sketch: {}};
				var projectId = record.attr('project');
				if( !record.attr('project') ) { reject('A parent project identifier property must be present on records of type \'sketch\''); }

                record.eachAttribute(function(attrName, meta) {
                    _record.sketch[attrName] = record.attr(attrName);
                });
				url = url + '/projects/' + projectId + '/sketches';
			} else if( type.modelName === 'alp' ) {
                    _record = {
                        alps: {
                            name: record.attr('name'),
                            description: record.attr('description'),
                            contentType: record.attr('contentType'),
                            source: record.attr('source'),
                        }
                    };
                url = url + '/alps';
			} else if( type.modelName === 'crudnode' ) {
                var sketchId = record.attr('sketch');
				if( !record.attr('sketch') ) { reject('A sketch identifier property must be present on records of type \'crudnode\''); }

                var _record = { crudnode: {}};

                record.eachAttribute(function(attrName, meta) {
                    _record.crudnode[attrName] = record.attr(attrName);
                });

                url = url + '/sketches/' + sketchId + '/crudnodes';

			} else if( type.modelName === 'hypernode' ) {
                var sketchId = record.attr('sketch');
				if( !record.attr('sketch') ) { reject('A sketch identifier property must be present on records of type \'hypernode\''); }
                _record = {
                    hypernode: {
                        name: record.attr('name'),
                        nodeClass : record.attr('nodeClass'),
                        url: record.attr('url'),
                        description: record.attr('description'),
                        contentType: record.attr('contentType'),
                        headers: record.attr('headers'),
                        statusCode: record.attr('statusCode'),
                        reason: record.attr('reason'),
                        body: record.attr('body'),
                        transitions: record.attr('transitions'),
                        method: record.attr('method'),
                    }
                };
                url = url + '/sketches/' + sketchId + '/hypernodes';
            } else if( type.modelName === 'nodecollection' ) {
                var sketchId = record.attr('sketch');
				if( !record.attr('sketch') ) { reject('A parent sketch identifier property must be present on records of type \'hypernode\''); }
                _record = {
                    collection: record.attr('nodes')
                }
                url = url + '/sketches/' + sketchId + '/hypernodes/collection';

            } else if ( type.modelName === 'map' ) {
                var projectId = record.attr('project');
				if( !record.attr('project') ) { reject('A parent project identifier property must be present on records of type \'map\''); }
                _record = {
                    map :  {
                        name: record.attr('name'),
                        description: record.attr('description'),
                        steps: record.attr('steps')
                    }
                };
                url = url + '/projects/' + projectId + '/maps';
            } else {
				reject('unknown record type');
			}

      session.authorize('authorizer:rapido', (headerName, headerValue) => {
  			createObject(headerValue, url, _record, function(error, response) {
  				if( !error ) {
                      resolve(response.result);
                  } else { reject(error); }
  			});
      });
		});

	},
	updateRecord: function(store, type, record) {
		url = host;
		var _record;

		return new Promise(function(resolve,reject) {
            if( type.modelName === 'project' ) {
                var _record = {};

                record.eachAttribute(function(attrName, meta) {
                    _record[attrName] = record.attr(attrName);

                });

                url = url + '/projects/' + record.get('id');
            } else if( type.modelName === 'resource' ) {
				var projectId = record.attr('project');
				if( !projectId ) { reject('A parent project identifier property must be present for records of type \'resource\''); }
				_record  = {
					resource:  {
						name: record.attr('name'),
						description: record.attr('description'),
						responses: record.attr('responses'),
						url: record.attr('url'),
						children: record.attr('children'),
						parent: record.attr('parent'),
						methods: record.attr('methods'),
                        class: record.attr('class')
					}
				};
				url = url + '/projects/' + projectId + '/resources/' + record.get('id');

			} else if( type.modelName === 'hypernode' ) {
                _record = {
                    hypernode: {
                        sketch: record.attr('sketch'),
                        name: record.attr('name'),
                        nodeClass: record.attr('nodeClass'),
                        url: record.attr('url'),
                        description: record.attr('description'),
                        contentType: record.attr('contentType'),
                        headers: record.attr('headers'),
                        statusCode: record.attr('statusCode'),
                        reason: record.attr('reason'),
                        body: record.attr('body'),
                        method: record.attr('method'),
                        transitions: record.attr('transitions'),
                        method: record.attr('method'),
                        x: record.attr('x'),
                        y: record.attr('y')
                    }
                };
                url = url + '/hypernodes/' + record.get('id');
            } else if( type.modelName === 'map' ) {
				if( !record.attr('project') ) { reject('A parent project identifier property must be present on records of type \'map\''); }
                var projectId = record.attr('project');
                var mapId = record.get('id');
                _record = {
                    map :  {
                        name: record.attr('name'),
                        description: record.attr('description'),
                        steps: record.attr('steps')
                    }
                };
                url = url + '/projects/' + projectId + '/maps/' + mapId;
            } else {
				reject('this record type cannot be updated.');
			}

			updateObject(url, _record, function(error, response) {
				if( !error ) {
                    if( response ) {
                    resolve(response[0]);
                    }
                    // Force a reload of the model in the Ember data store to reflect the updated version of the data


                }
				else { reject(error); }
			});
		});
	},
	deleteRecord: function(store, type, record) {
		url = host;

		return new Promise(function(resolve,reject) {
			if( type.modelName === 'project' ) {
				url = url + '/projects/' + record.id;
			} else if( type.modelName === 'resource' ) {
				var projectId = record.attr('project');
				if( !projectId ) { reject('A parent project identifier property must be present on records of type \'resource\''); }
				url = url + '/projects/' + projectId + '/resources/' + record.get('id');
			} else {
				reject('unknown record type');
			}

			deleteObject(url, function(error) {
				if( !error ) { resolve(); }
				else { reject(error); }
			});
		});
	}
});
