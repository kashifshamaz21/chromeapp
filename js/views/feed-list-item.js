define(["jquery",
		"underscore",	
        "backbone",
        "util/controller",
        "models/feed",
        "collections/feed-collection",
        "text!templates/job-post.html",
        "text!templates/new-profile-pic.html",
        "moment"
        ], function($, _, Backbone, Controller, Feed, FeedCollection, JobFeed, NewProfilePic){

    var UserFeedListItem = Backbone.View.extend({

        className: "feed-item",

        events: {
        
        },

    	initialize: function(options) {
    		_.bindAll(this);
    	},

    	render: function  () {
            var feedType = this.model.get("updateType");
            switch(feedType) {
                case "JOBP": this.renderJobPost(); break;
                case "PICU":  this.NewProfilePic(); break;
                default:
                    console.log("feedType is ", feedType);
            }
            return this.el;
    	},

        renderJobPost: function () {
            this.$el.append(JobFeed);        
            this.$el.find("#company").text(this.model.get("updateContent").company.name);
            this.$el.find("#job-designation").text(this.model.get("updateContent").job.position.title);
            this.$el.find("#job-posted-time").text(moment(this.model.get("timestamp")).fromNow());
            this.getImage(this.$el.find('.feed_profile_pic'), "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_65_65/p/2/000/1ed/395/22a2b98.png");
        },

        NewProfilePic: function () {
            this.$el.append(NewProfilePic);
            var fullName = this.model.get("updateContent").person.firstName + " " + this.model.get("updateContent").person.lastName;
            var newPicUrl = this.model.get("updateContent").person.pictureUrl;
            this.$el.find("#person").text(fullName);
            this.getImage(this.$el.find('#new-profile-pic'), newPicUrl);
            this.getImage(this.$el.find('.feed_profile_pic'), newPicUrl);
        },

        getImage: function (parent, imageUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', imageUrl, true);
            xhr.responseType = 'blob';
            xhr.onload = function(e) {
              var img = document.createElement('img');
              img.src = window.URL.createObjectURL(this.response);
              img.class = "meta_image";
              $(parent)[0].appendChild(img);
            };
            xhr.send();
        }
        
    });
    return UserFeedListItem;
});