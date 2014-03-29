define(["jquery",
        "backbone",
        "models/job-suggestion"
        ], function($, Backbone, JobSuggestion){

    var JobSuggestions = Backbone.Collection.extend({
        
        model: JobSuggestion,

        initialize: function() {

        }
    });
    return JobSuggestions;
});