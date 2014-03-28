define(["jquery",
        "backbone"
        ], function($, Backbone){

    Backbone.ajax = function() {
            return $.ajax.apply($, arguments);
    };
    var UserFeedCollection = Backbone.Collection.extend({
        
    });
    return UserFeedCollection;
});