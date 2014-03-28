LinkedIn = {
    checkConnectivity: function() {
        var condition = navigator.onLine ? true : false;
        return condition;
    }
};

require(["backbone",
        "jquery",
        "keymaster",
        "underscore",
        "js/views/feed-list-view",
        "corgi",
        "bootstrap"], function(Backbone, $, key, _, FeedListView) {

    var StartUp = Backbone.View.extend({
        el : "body",

        events: {
        },
        initialize: function () {
            this.feedListView = new FeedListView();
        },

        renderUserFeed: function() {
            this.feedListView.render();
        }
    });


    $(document).ready(function() {
        var startUp = new StartUp();
        startUp.renderUserFeed();
    });
});
