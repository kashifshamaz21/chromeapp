var require = {

    baseUrl: "./",

    paths: {
      backbone : "js/lib/backbone",
      underscore: "js/lib/underscore",
      jquery : "js/lib/jquery-1.8.2.min",
      jqueryCustomUI : "js/lib/jquery-ui-1.8.24.custom.min",
      my: "js/lib/my.class.min",
      bootstrap3: "js/lib/bootstrap-3.0.3/bootstrap",
      fullCalendar: "js/lib/fullcalendar",
      keymaster : "js/lib/keymaster",
      'jquery.easing'               : 'lib/jquery.easing.1.3',
      'jquery.placeholder'          : 'lib/jquery.placeholder',
      'jquery.scrollpane'           : 'lib/jquery.scrollpane',
      'jquery.ui'                   : 'lib/jquery-ui-1.9.2',
      'jquery.contactsAutoComplete' : 'lib/jquery.contactsAutoComplete',
      'jquery.html5uploader'        : 'lib/jquery.html5uploader',
      'jquery.fileupload'           : 'lib/jquery.fileupload',
      'jquery.iframe-transport'     : 'lib/jquery.iframe-transport',
      plupload                    : 'lib/plupload/js/plupload.full',
      'jquery.ui.widget'            : 'lib/jquery.ui.widget',
      json2                       : 'lib/json2',
      minpubsub                   : 'lib/minpubsub',
      moment                      : 'lib/moment',
      'my.Class'                    : 'lib/my.class',
      store                       : 'lib/store',
      'underscore.string'           : 'lib/underscore.string',
      sockjs                      : 'lib/sockjs-0.3.min',
      q                           : 'js/lib/q'
    },

    shim : {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports : "Backbone"
        },
        bootstrap3: {
            deps: ["jquery"]
        },
        fullCalendar: {
          deps: ["jquery"]
        },
        jqueryCustomUI: {
          deps: ["jquery"]
        },
        underscore: {
          exports: "_"
        },
        keymaster: {
          exports: "key"
        }
    }
};