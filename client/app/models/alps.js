import DS from "ember-data";

var inflector = Ember.Inflector.inflector;
inflector.irregular('alps', 'alps');


 
var alps = DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    contentType: DS.attr('string'),
    source: DS.attr('string'),
    json: DS.attr()
});
  
export default alps;
