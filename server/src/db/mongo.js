var mongo = require('mongoskin')
var RSVP = require('rsvp');

var conn;

function parseFilter(filter) {

    if( !filter ) {
        return {};
    }
    var _filter = {};

    for( var prop in filter ) {
        if( prop === 'id' ) {
            _filter._id = mongo.helper.toObjectID(filter.id);
        }else {
            _filter[prop] = filter[prop];
        }
    } 
    return _filter;
}

var init = function() {
    var connUrlString = '';

    if( !process.env.MONGO_URL ) {
        console.error('Error: The environment variable MONGO_URL must be set!');
        process.exit();
    }
    if( process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD ) {
        connUrlString = process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + "@" + process.env.MONGO_URL;
    }else {
        connUrlString = process.env.MONGO_URL;
    }
    conn = mongo.db(connUrlString, {auto_reconnect: true});
    return conn;
}

var findAll = function(resourceType, filter, callback) {
    if( !conn ) { callback( 'this database connector must be initialized first.'); return; }
    console.log(conn);

    conn.collection(resourceType).find(parseFilter(filter)).sort({created: -1}).toArray(function( err, result ) {
       callback(err, result);
    });
}

var findOne = function(resourceType, filter, callback) {
    if( !conn ) { callback( 'this database connector must be initialized first.'); return; }

    conn.collection(resourceType).find(parseFilter(filter)).toArray(function( err, result ) {
       if( err || !result) {
           callback(err);
           return;
       }
       if( result.length === 0 ) { 
           callback(err, null); 
       }else { 
           callback(err, result[0]);
       }
    });
}

var insert = function(resourceType,resource, callback) {
    if( !conn ) { callback( 'this database connector must be initialized first.'); return; }
    conn.collection(resourceType).insert(resource, function(err, newResource) {
        if( err || !newResource ) {
            callback(err);
            return;
        }
        callback(err, newResource[0]._id.toString(), newResource[0]);
    });
}

var replace = function(resourceType, resource, callback) {
    if( !conn ) { callback( 'this database connector must be initialized first.'); return; }
    conn.collection(resourceType).update({_id: mongo.helper.toObjectID(resource.id) }, resource, function(err) {
        callback(err);
    });
}

var update = function(resourceType, id, patch, callback) {
    if( !conn ) { callback( 'this database connector must be initialized first.'); return; }
    conn.collection(resourceType).update({_id: mongo.helper.toObjectID(id)}, patch, function(err) {
        callback(err);
    });
}

var promiseInsert = function( resourceType, resource ) {
    return new RSVP.Promise(function( resolve, reject ) { 
        insert(resourceType, resource, function( err, newResourceId, newResource ) {
            if( err ) {
                reject(err);
            }else {
                resolve(newResource);
            }
        });
    });
}

module.exports = {
    init: function() {
        return init();
    },
    findAll: function(resourceType, filter, sort, callback) {
        return findAll(resourceType, filter, sort, callback);
    },
    findOne: function(resourceType, filter, callback) {
        return findOne(resourceType, filter, callback);
    },
    promiseInsert: function( resourceType, resource ) {
        return promiseInsert( resourceType, resource ); 
    },
    insert : function(resourceType, resource, callback) {
        return insert( resourceType, resource, callback);
    },
    update: function(resourceType, id, patch, callback) {
        return update(resourceType, id, patch, callback);
    },
    replace: function(resourceType, resource, callback) {
        return replace(resourceType, resource, callback);
    }
}
