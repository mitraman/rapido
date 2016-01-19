import DS from "ember-data";

export default DS.JSONSerializer.extend({


normalize: function(type, hash) {
    console.log('*** normalize ***');
    console.log(type);
    console.log(hash);
    hash.id = hash._id;
	return hash;
},

normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    console.log('***********************');
  console.log('normalizeResponse');
  return {};
},


// TODO: This method should be deprecated, but the normalize methods are not being called
// when I comment this out.
extractArray: function(store, primaryType, rawPayload) {

    console.log('*** extractArray ***');

    return rawPayload.result ? rawPayload.result : rawPayload;
}

/*
extractCreateRecord: function(store, typeClass, payload, id, requestType) {

    //console.log('*** extractCreateRecord ***');

    if( payload.result ) {
        return payload.result;
    }

    return this.extractSave(store, typeClass, payload, id, requestType);
},

extract: function(store, typeClass, payload, id, requestType) {
    console.log('*** extract ***');
    console.log(payload)
    console.log(id)
    console.log(requestType)
    console.log(typeClass)

    this.extractMeta(store, typeClass, payload);

    if( payload.result ) {
        return payload.result;
    }

    var specificExtract = "extract" + requestType.charAt(0).toUpperCase() + requestType.substr(1);
    return this[specificExtract](store, typeClass, payload, id, requestType);
},

extractSave: function(store, typeClass, payload, id, requestType) {
    //console.log('*** extractSave ***');
    return this.extractSingle(store, typeClass, payload, id, requestType);
},

extractSingle: function(store, typeClass, payload, id, requestType) {
    console.log('*** extractSingle ***');
    var normalizedPayload = this.normalizePayload(payload);
    if( requestType === 'updateRecord' ) {
        // Pig-headed ember data insists that an ID should be returned, so just use the original ID
        return {id: id};
    }
    return this.normalize(typeClass, normalizedPayload);
},

*/

});
