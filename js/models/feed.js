define(["jquery",
        "backbone"
        ], function($, Backbone){

    Backbone.ajax = function() {
            return $.ajax.apply($, arguments);
    };
    var UserFeed = Backbone.Model.extend({
       initialize: function  (argument) {
           
       } 
    }, {
        translateJobUpdate: function  (update) {
            return {

            }
        }
    });
    return UserFeed;
});
