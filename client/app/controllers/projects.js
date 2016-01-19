import Ember from 'ember';

export default Ember.Controller.extend({

//TODO: Move this to the route and delete the controller

  actions: {
    saveNewProject(name, description, selectedProjectType, selectedMediaType) {      
      let newRecord = this.store.createRecord('project', {
        name: name,
        description: description,
        contentType: selectedMediaType,
        projectType: selectedProjectType
      })
      newRecord.save();
    }
  }
});
