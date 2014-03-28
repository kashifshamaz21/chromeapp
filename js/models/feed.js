define(["jquery",
        "backbone"
        ], function($, Backbone){

    Backbone.ajax = function() {
            return $.ajax.apply($, arguments);
    };
    var UserFeed = Backbone.Model.extend({
        
    });
    return UserFeed;
});
