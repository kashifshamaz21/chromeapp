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
            this.startUp = options.startUp;
    		this.collection = new FeedCollection();
            this.collection.bind("add", this.addOneFeed, this);
            Backbone.on("sharePosted", this.newShareFeed);
    	},

        addOneFeed: function (model) {
            var feedType = model.get("updateType");
            var selectorId = "feed-" + model.id;
            var feedItem = new FeedListItem({
                id: selectorId,
                model: model
            });
            if(feedType === "MY_NEW_POST") {
                this.$("#feed-list").prepend(feedItem.render());
            } else {
                this.$("#feed-list").append(feedItem.render());
            }
        },

        newShareFeed: function (model) {
            // body...
            this.collection.add(model);
        },

    	render: function  (argument) {
    		this.getUserFeed();
    	},

    	getUserFeed: function() {
    		this.startUp.getFeeds(this.getUserFeedSuccess);
    	},

    	getUserFeedSuccess: function(error, jobUpdates) {
            if(!error) {
                var newModels = [];
                _.each(jobUpdates.values, _.bind(function(update, index, updateList){ 
                    var model =  new Feed(update);
                    newModels.push(model);
                }, this));
                this.collection.set(newModels);  
            } else {
                this.getUserFeedFailed();
            }
    	},

    	getUserFeedFailed: function () {
    		console.log("get job updates failed");
    	}
        
    });
    return UserFeedListView;
});