define(["jquery",
        "backbone",
        "util/controller",
        "models/feed",
        "collections/feed-collection",
        "lib/xm2json"
        ], function($, Backbone, Controller, Feed, FeedCollection){

    var UserFeedListView = Backbone.View.extend({

    	initialize: function(options) {

    		this.collection = new FeedCollection();
    	},

    	render: function  (argument) {
    		this.getJobUpdates();
    	}

    	getJobUpdates: function() {
    		Controller.getJobUpdates(getJobUpdatesSuccess, getJobUpdatesFailed);
    	},

    	getJobUpdatesSuccess: function  (jobUpdates) {
    		var collection = $.xml2json(jobUpdates);
    		var newModels = [];
    		$.each(collection.update, _.bind(function(i, update){ 
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