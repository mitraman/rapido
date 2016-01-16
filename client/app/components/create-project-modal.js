import Ember from 'ember';

export default Ember.Component.extend({

  projectTypes: [{name:"CRUD", value:"CRUD"},{name:"Hypermedia", value:"Hypermedia"}],
  mediaTypes: [
    {category: "CRUD", types: [{name: "JSON", value: "application/json"}]},
    {category: "Hypermedia", types: [
      {name: "HAL", value:"application/hal"},
      {name: "Collection JSON", value:"application/cj"}]}
  ],
  selectedProjectType: 'Hypermedia',
  selectedMediaType: 'application/hal',
  projectName: '',
  description: '',
  dynamicMediaTypes: Ember.computed('this.mediaTypes','this.selectedProjectType', function() {
    for (let mediaType of this.mediaTypes) {
      if(mediaType.category === this.selectedProjectType){
        return mediaType.types;
      }
    }
    return [];
  }),

  actions: {
    createProject() {
      // Fire a create project event to store the new project in the
      // datastore
      this.sendAction('saveProjectAction', this.projectName, this.description, this.selectedProjectType, this.selectedMediaType)
    }
  }
});
