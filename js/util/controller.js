define(["jquery",
        "underscore",
        ], function($, _) {
        
    var getJobUpdates = con + "/v1/people/id=" + myId + "/network/updates?type=JOBS";

    var Controller = {

        getJobUpdates: function  (success, failure) {
            $.ajax({
                type        : "GET",
                url         : getJobUpdates,
                contentType : "application/json; charset=utf-8",
                cache       : false,
                success     : success,
                error       : failure
            });   
        }
    };

    return Controller;
});
