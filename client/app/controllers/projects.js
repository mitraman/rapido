import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    saveNewProject(name, description, selectedProjectType, selectedMediaType) {
      console.log('createProject bubbled up');
      console.log(name+","+ description +","+ selectedProjectType +","+ selectedMediaType);
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
