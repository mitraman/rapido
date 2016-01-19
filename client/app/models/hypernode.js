import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
    nodeClass : DS.attr('string'),
    sketch: DS.attr('string'),
    url: DS.attr('string'),
    description: DS.attr('string'),
    contentType: DS.attr('string'),
    headers: DS.attr(),
    statusCode: DS.attr('string'),
    reason: DS.attr('string'),
    body: DS.attr('string'),
    transitions: DS.attr(),
    method: DS.attr(),
    x: DS.attr(),
    y: DS.attr(),
    // Tags allow us to add descriptive labels to nodes (e.g.: CJ adds read, update, delete and create tags to nodes)
    tags: DS.attr()
});
