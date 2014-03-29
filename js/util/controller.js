define(["jquery",
        "underscore",
        ], function($, _) {
        
    //var getJobUpdates = con + "/v1/people/id=" + myId + "/network/updates?type=JOBS";
    var getJobUpdates = "/v1/people/id=874398/network/updates?type=JOBS";

    var Controller = {

        getJobUpdates: function  (success, failure) {
            
            /*$.ajax({
                type        : "GET",
                url         : getJobUpdates,
                headers     : { "x-li-format" : "json" }
                dataType    : "application/json",
                cache       : false,
                success     : success,
                error       : failure
            });*/
            var data = {
                _total: 250,
                _start: 0,
                _count: 10,
                values: [{
                    timestamp : 1262645073369,
                    updateType: "JOBP",
                    updateContent: {
                        job: {
                            id: 8162505,
                            position: { title: "Editor" }
                        },
                        company: { name: "Irving Books" },
                        jobPoster: {
                            id: "D4PrjjQMm1",
                            firstName: "John",
                            lastName: "Irving",
                            headline: "Author"
                        },
                        siteJobRequest: {
                            url: "http://www.linkedin.com/jobs?viewJob=&amp;jobId=8162505"
                        }
                    }
                },  
                {
                    timestamp : 5677645076878,
                    updateType: "JOBP",
                    updateContent: {
                        job: {
                            id: 7686900,
                            position: { title: "Editor" }
                        },
                        company: { name: "ndkjwendl" },
                        jobPoster: {
                            id: "D4PrjjQMm1",
                            firstName: "sdfvdv",
                            lastName: " dfbfav",
                            headline: "Writer"
                        },
                        siteJobRequest: {
                            url: "http://www.linkedin.com/jobs?viewJob=&amp;jobId=8162505"
                        }
                    }
                },
                {
                    timestamp : 1262645073369,
                    updateType: "PICU",
                    updateContent: {
                        person: {
                            id: "lJW0vcN4d6",
                            firstName: "John",
                            lastName: "Irving",
                            headline: "Author",
                            pictureUrl: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_200_200/p/7/005/050/20e/3a01baa.jpg"
                        }
                    }
                }]
            };
            success(data);   
        }
    };

    return Controller;
});
