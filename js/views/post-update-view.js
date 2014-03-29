define(["jquery",
		"underscore",	
        "backbone",
        "util/controller",
        "models/feed",
        "collections/feed-collection",
        "text!templates/post-update.html",
        "moment"
        ], function($, _, Backbone, Controller, Feed, FeedCollection, NewPostInput){

    var ShareNewPost = Backbone.View.extend({

        el: "#share-post",

        events: {
            "click #new-post-save": "postShare"
        },

    	initialize: function(options) {
    		_.bindAll(this);
            this.startUp = options.startUp;
    	},

        render: function () {
            this.$el.append(NewPostInput);
            this.getImage(this.$el.find('.feed_profile_pic'), "http://s.c.lnkd.licdn.com/scds/common/u/img/themes/katy/ghosts/profiles/ghost_profile_60x60_v1.png");
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
        },

        postShare: function () {
            var comment = $("#new-post-textarea").val();
            if(comment !== '') {
                this.startUp.postShare({
                    comment: comment,
                    title: comment,
                    description: "",
                    commentUrl: "https://developer.linkedin.com/documents/share-api",
                    imageUrl: ""
                }, this.postSuccess);
            }
        },

        postSuccess: function  (error, updateKey) {
            if(!error) {
                /*var comment = $("#new-post-textarea").val();
                $("#new-post-textarea").text("");
                var newPost = new Feed({
                    updateType: "MY_NEW_POST",
                    comment: comment,
                    title: comment,
                    description: "Check out the LinkedIn Share API! LinkedIn Developers Documentation On Using the Share API Leverage the Share API to maximize engagement on user-generated content on LinkedIn...",
                    commentUrl: "developer.linkedin.com",
                    imageUrl: null
                });
                Backbone.trigger("sharePosted", newPost);*/
                $("#new-post-textarea").text("");
                this.startUp.getShareJson(updateKey, this.getShareJsonSuccess);
            }
        },

        getShareJsonSuccess: function  (error, data) {
            // body...
            if(!error) {
                var comment = $("#new-post-textarea").val();
                data.updateType = "MY_NEW_POST";
                data.updateContent.person.currentStatus = comment;
                var newPost = new Feed(data);
                $("#new-post-textarea").val("");
                Backbone.trigger("sharePosted", newPost);
            }
        }
        
    });
    return ShareNewPost;
});