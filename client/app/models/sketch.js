import DS from 'ember-data';

export default DS.Model.extend({
    project: DS.attr(),
    name: DS.attr('string'),
    description: DS.attr('string'),
    contentType: DS.attr('string'),
    zoom: DS.attr('string'),
    rootNodeX: DS.attr('string'),
    rootNodeY: DS.attr('string')  
});
