import Base from 'ember-simple-auth/authenticators/base';
import ENV from "../config/environment";

var host = ENV.backend;

const { service } = Ember.inject;

export default Base.extend({

  session: service('session'),

  restore: function(data) {
      return new Promise(function(resolve, reject) {
          if( data.token ) {
              resolve({token:data.token});
          }
      });
  },

  authenticate: function(username, password) {    

    // Try to make call to backend for authentication
    return new Promise(function(resolve,reject) {

        var loginRequest = $.ajax({
            url: host + '/login',
            type: 'POST',                    
            beforeSend: function( request ) {
                var basicAuthString = 'Basic ' + btoa(username + ':' + password);
                //console.log(basicAuthString);                        
                request.setRequestHeader("Authorization", basicAuthString);
            }
        });

        loginRequest.done( function( data, textStatus, jqXHR ) {                    
            resolve({token:data.token});
        });

        loginRequest.fail( function( data, textStatus, jqXHR ) {
            reject(textStatus);
        });

    });

  },

  invalidate: function(data) {
    var session = this.get('session');
      return new Promise(function(resolve,reject){ ;

          session.authorize('authorizer:rapido', (headerName, headerValue) => {            

            var logoutRequest = $.ajax({
              url: host + '/logout',
              type: 'POST',
              headers: { Authorization: headerValue } 
            });

            logoutRequest.done( function( data, textStatus, jqXHR ) {                    
                resolve({token:data.token});
            });

            logoutRequest.fail( function( data, textStatus, jqXHR ) {
              console.log('logout request failed');
              reject(textStatus);
            });
          })

      });
  }
});
