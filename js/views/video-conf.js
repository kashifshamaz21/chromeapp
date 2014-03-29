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
        
        },

        initialize: function(options) {
            _.bindAll(this);
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
        }
        
    });
    return ShareNewPost;
});