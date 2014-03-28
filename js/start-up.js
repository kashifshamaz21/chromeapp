LinkedIn = {
    checkConnectivity: function() {
        var condition = navigator.onLine ? true : false;
        return condition;
    }
};

require(["backbone",
        "jquery",
        "keymaster",
        "underscore"], function(Backbone, $, key, _) {

var StartUp = Backbone.View.extend({
    el : "body",

    events: {
    },
    initialize: function () {
    }
});


$(document).ready(function() {
    var startUp = new StartUp();
});
});
