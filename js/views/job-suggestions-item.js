define(["jquery",
		"underscore",	
        "backbone",
        "models/job-suggestion",
        "text!templates/job-suggestion.html",
        "moment"
        ], function($, _, Backbone, 
                JobSuggestion, JobSuggestionTemplate){

    var JobSuggestionsItem = Backbone.View.extend({

        events: {
        
        },

    	initialize: function(options) {
    		_.bindAll(this);
            this.render();
    	},

        render: function () {
            var jobDescription = this.model.get("descriptionSnippet");
            var trimmedDesc = $.trim(jobDescription);
            var shortDescription = trimmedDesc.substring(0, 100);
            if(trimmedDesc.length > 100) {
                shortDescription = shortDescription + '...';
            }
            this.$el.append(JobSuggestionTemplate);  
            this.$el.find('.job-company').text(this.model.get('company').name);
            this.$el.find('.job-description').text(shortDescription);
            this.$el.find('.job-location').text(this.model.get('locationDescription'));

            /*this.$el.find("#company").text(this.model.get("updateContent").company.name);
            this.$el.find("#job-designation").text(this.model.get("updateContent").job.position.title);
            this.$el.find("#job-posted-time").text(moment(this.model.get("timestamp")).fromNow());
            this.getImage(this.$el.find('.feed_profile_pic'), "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_65_65/p/2/000/1ed/395/22a2b98.png");*/
            return this.el;
        }
    });
    return JobSuggestionsItem;
});