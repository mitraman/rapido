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
        this.route('tree', { path: '/:sketch_id/tree' });
        this.route('graph', { path: '/:sketch_id/graph' }, function() {
            this.route('hypernode', { path: '/:node_id' }, function() {
                this.route('create-link', { path: '/create-link' } );
            })
        });
    });
  });  
});

export default Router;
