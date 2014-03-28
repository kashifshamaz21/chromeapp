define(["jquery",
        "backbone",
        "models/feed"
        ], function($, Backbone, Feed){

    Backbone.ajax = function() {
            return $.ajax.apply($, arguments);
    };
    var UserFeedCollection = Backbone.Collection.extend({
        
        model: Feed,

        initialize: function() {

        }
    });
    return UserFeedCollection;
});