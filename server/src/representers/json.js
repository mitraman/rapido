
module.exports = function() {

    return {
        errorMessage: function(message) {
            return '{\n\t"error": "' + message + '"\n}';
        },

        formatCollection: function(name, collection) {
            console.log(name);
            console.log(collection);
            // Convert '_id' properties to 'id'
            for( var i = 0; i < collection.length; i++ ) {
                if( collection[i]._id ) {
                    collection[i].id = collection[i]._id;
                    delete collection[i]._id;
                }
            }

            var body = {};
            body.type = name;
            body.result =  collection;
            console.log(body);
            return body;
        },

        formatObject : function(name, obj) {
            if( obj._id ) {
                obj.id = obj._id;
                delete obj._id;
            }
            var body = {};
            body.type = name;
            body.result = obj;
            return body;
        }
    };
}
