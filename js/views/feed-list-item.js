define(["jquery",
		"underscore",	
        "backbone",
        "util/controller",
        "models/feed",
        "collections/feed-collection",
        "text!templates/job-post.html",
        "moment"
        ], function($, _, Backbone, Controller, Feed, FeedCollection, JobFeed){

    var UserFeedListItem = Backbone.View.extend({

        className: "feed-item",

        events: {
        
        },

    	initialize: function(options) {
    		_.bindAll(this);
    	},

    	render: function  (argument) {
    		this.$el.append(JobFeed);
            this.$el.find("#company").text(this.model.get("updateContent").company.name);
            this.$el.find("#job-designation").text(this.model.get("updateContent").job.position.title);
            this.$el.find("#job-posted-time").text(moment(this.model.get("timestamp")).fromNow());
            
            return this.el;
    	}
        
    });
    return UserFeedListItem;
});