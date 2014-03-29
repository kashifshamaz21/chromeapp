define(["jquery",
		"underscore",	
        "backbone",
        "models/job-suggestion",
        "collections/job-suggestions",
        "views/job-suggestions-item"
        ], function($, _, Backbone, JobSuggestion, 
            JobSuggestions, JobSuggestionsItem){

    var JobSuggestionsView = Backbone.View.extend({

    	el: "#job-suggestions-wrapper",

        events: {

        },

    	initialize: function(options) {
    		_.bindAll(this);
            this.startUp = options.startUp;
    		this.collection = new JobSuggestions();
            this.collection.bind("add", this.addOne, this);
            Backbone.on("renderJobSuggestions", this.render);
    	},

        addOne: function (model) {
            var selectorId = "job-suggest-" + model.id;
            this.$(".sidebar_interior").append('<div class="' + selectorId + '"></div>');
            var jobSuggestionItem = new JobSuggestionsItem({
                el: '.' + selectorId,
                model: model
            });
            
        },

    	render: function  (argument) {
            this.startUp.getJobSuggestions(this.getJobSuggestionsCallback);
    	},

    	getJobSuggestionsCallback: function(error, jobSuggestions) {
            if(!error) {
                var newModels = [];
                _.each(jobSuggestions.jobs.values, _.bind(function(update, index, updateList){ 
                    var model =  new JobSuggestion(update);
                    newModels.push(model);
                }, this));
                this.collection.set(newModels);
            }
    	}
        
    });
    return JobSuggestionsView;
});