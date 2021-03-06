var require = {

    baseUrl: "./",

    paths: {
      backbone : "js/lib/backbone",
      underscore: "js/lib/underscore",
      jquery : "js/lib/jquery",
      bootstrap: "js/bootstrap.min",
      keymaster: "js/lib/keymaster",
      corgi: "js/corgi",
      bootstraphoverdropdown: "js/lib/bootstrap-hover-dropdown",
      models: "js/models",
      views: "js/views",
      collections: "js/collections",
      templates: "js/templates",
      util: "js/util",
      text: "js/lib/text",
      slimscroll: "js/lib/slimscroll",
      moment: "js/lib/moment",
      "socket.io.min" : "js/socket.io.min",
      RTCPeerConnection : "js/RTCPeerConnection",
      "conf-settings" : "js/conf-settings",
      conference : "js/conference",
      xml2json: "js/lib/xml2json"
    },
    shim : {
        jquery: {
          exports: "$"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports : "Backbone"
        },
        bootstrap: {
            deps: ["jquery"]
        },
        slimscroll: {
            deps: ["jquery"]
        },
        underscore: {
          exports: "_"
        },
        bootstrap: {
          deps: ["jquery"]
        },
        corgi: {
          deps: ["jquery"]
        },
        "conf-settings": {
          deps: ["socket.io.min"]
        }
    }
};