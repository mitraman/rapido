import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('projects');
  this.route('project', { path: '/:project_id' }, function() {
    this.route('vocabulary', { path: '/vocab' });
  });  
});

export default Router;
