var require = {

    baseUrl: "./",

    paths: {
      backbone : "js/lib/backbone",
      underscore: "js/lib/underscore",
      jquery : "js/lib/jquery",
      bootstrap: "js/lib/bootstrap",
      keymaster: "js/lib/keymaster"
    },

    shim : {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports : "Backbone"
        },
        bootstrap: {
            deps: ["jquery"]
        },
        underscore: {
          exports: "_"
        }
    }
};