import DS from "ember-data";

export default DS.JSONAPISerializer.extend({

keyForAttribute: function(attr, method) {
    return attr;
    //return Ember.String.underscore(attr).toUpperCase();
},



normalizeRapidoArray: function(payload) {
    
    var jsonAPIDoc = { data: [] };    

    for( var i = 0; i < payload.result.length; i++ ) {
                
        var resource = this._normalizeRapidoElement(payload.type, payload.result[i]);
        jsonAPIDoc.data.push(resource);

    }

    return jsonAPIDoc;
},

normalizeRapidoObject: function(payload) {
    //var jsonAPIDoc = { data: [] };
    var jsonAPIDoc = { data: {} };
            
    var resource = this._normalizeRapidoElement(payload.type, payload.result);
    //jsonAPIDoc.data.push(resource);
    jsonAPIDoc.data = resource;
    
    return jsonAPIDoc;  
},

_normalizeRapidoElement: function(type, rapidoElement) {
        
    console.log('normalizeRapidoElement');
    // store the attributes
    var attributes = {};      
    var keys = Object.keys(rapidoElement);

    for( var j = 0; j < keys.length; j++ ) {
        var key = keys[j];
    
        if( key != 'id') {
            attributes[key] = rapidoElement[key];
        }
    
    }
                
    return {
        type: type,
        id: rapidoElement.id,
        attributes: attributes
    };
},

// Convert a Rapido API response into Ember's internal json-api format
normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    if( !payload.result) {
        throw new Ember.Error('Unable to find a result property in this Rapido API response');
    }

    if( Array.isArray(payload.result)) {
        return this._super(store, primaryModelClass, this.normalizeRapidoArray(payload), id, requestType);        
    }

    // Assume this is an object response
    var jsonApiDoc = this.normalizeRapidoObject(payload);  
    console.log(jsonApiDoc);      
    return this._super(store, primaryModelClass, jsonApiDoc, id, requestType);    
}


/***
,

normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
    console.log('normalizeArrayResponse')
},

normalizeFindAllResponse: function(store, primaryModelClass, payload, id, requestType)  {
    console.log('normalizeFindAllResponse');
},

normalizeFindManyResponse: function(store, primaryModelClass, payload, id, requestType) {
    console.log('normalizeFindManyResponse');
}
***/

});
