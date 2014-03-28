define(["jquery",
		"underscore",	
        "backbone",
        "util/controller",
        "models/feed",
        "collections/feed-collection",
        "views/feed-list-item",
        "slimscroll"
        ], function($, _, Backbone, Controller, Feed, FeedCollection, FeedListItem){

    var UserFeedListView = Backbone.View.extend({

    	el: "#user-feed-wrapper",

        events: {

        },

    	initialize: function(options) {
    		_.bindAll(this);
    		this.collection = new FeedCollection();
            this.collection.bind("add", this.addOneFeed, this);
            $("#user-feed-wrapper").slimScroll({
                height: "700px"
            });
    	},

        addOneFeed: function (model) {
            var feedType = model.get("updateType");
            var selectorId = "feed-" + model.id;
            var feedItem = new FeedListItem({
                id: selectorId,
                model: model
            });
            this.$("#feed-list").append(feedItem.render());
        },

    	render: function  (argument) {
    		this.getJobUpdates();
    	},

    	getJobUpdates: function() {
    		Controller.getJobUpdates(this.getJobUpdatesSuccess, this.getJobUpdatesFailed);
    	},

    	getJobUpdatesSuccess: function(jobUpdates) {
    		var newModels = [];
    		_.each(jobUpdates.values, _.bind(function(update, index, updateList){ 
    			var model =  new Feed(update);
    			newModels.push(model);
    		}, this));
    		this.collection.set(newModels);
    	},

    	getJobUpdatesFailed: function (argument) {
    		console.log("get job updates failed");
    	}
        
    });
    return UserFeedListView;
});