import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('projects');
  this.route('project', { path: '/:project_id' }, function() {
    this.route('vocabulary', { path: '/vocab' });
    this.route('sketches', { path: '/sketch' }, function() {
        this.route('sketch', { path: '/:sketch_id'}, function() {
          this.route('graph', { path: '/graph'}, function() {})
        })        
    });
  });  
});

export default Router;
