LinkedIn = {
    checkConnectivity: function() {
        var condition = navigator.onLine ? true : false;
        return condition;
    }
};

require(["backbone",
        "jquery",
        "minpubsub",
        "keymaster",
        "underscore"], function(Backbone, $, PubSub, key, _) {

$(document).ready(function() {
    var startUp = new StartUp();
});
var StartUp = Backbone.View.extend({
    el : "body",

    events: {

        'click #password-config .config_save' : 'savePasswordConfig',
        'click #schedule-meeting' : 'scheduleMeeting',
        'click #instant-meeting' : 'joinCall',
        'click #calendar'      : 'showScheduledMeetings'
    },

    initialize: function () {
        console.log("initialize of startup");
        var _me = this;
        //this.registry = PubSub.getRegistry();
        chrome.storage.local.get(function(value) {
            LinkedIn.con = LinkedIn.con && LinkedIn.con === 'false' ? "http://" : "https://";
            LinkedIn.userId = value.settings_user_id;
            if (LinkedIn.sMeetingId && LinkedIn.sMeetingId !== 'null' && LinkedIn.sMeetingId !== '' && LinkedIn.sMeetingId !== null) {
                _me.initApp();
            } else {
                _me.resetAllSettings();
            }
            console.log("value", value);
        });

    },

    initApp: function() {
    },

    initConnectivityCallbacks: function() {
        var _me = this;
        window.setInterval(function(){
            if(LinkedIn.checkConnectivity()) {
                PubSub.publish("syncData");
                _me.offlineDialogShown = false;
            } else if(!_me.offlineDialogShown) {
                _me.showOfflineDialog();
                _me.offlineDialogShown = true;
            }
        }, 5000);
    },

    showOfflineDialog: function() {
        $('#offline-state').show().css('overflow', 'hidden').message({
            width : 460,
            height: 250,
            draggable: false,
            buttons : {
                'Ok' : function() {
                    $(this).dialog('close');
                }
            },
            buttonStyles : {
                "Accept" : "blue"
            }
        });
    },

    scheduleMeeting: function() {
        this.$el.find('.features').hide();
        this.schedulingView.render();
        this.$el.find('.scheduling-content').show();
    },

    initCalendar: function() {
    },

    showScheduledMeetings: function() {
        this.$el.find('.features').hide();
        this.schedulingCalendar.render();
        this.$el.find('.calendar').show();
    },

    registerKey: function(letter, handler){
        key(letter, function(){
            handler();
            return false;
        });
    },

    registerKeys: function() {
        var _me = this;
        var BINDINGS = {
            'escape': function() {
                if(chrome.app.window.current().isFullscreen()) {
                    chrome.app.window.current().restore();
                }
            },
            'f': function() {
                if(!chrome.app.window.current().isFullscreen()) {
                    chrome.app.window.current().fullscreen();
                }
            }
        };
        $.each(BINDINGS, function(letter, handler) {
            _me.registerKey(letter + ', shift+'+letter, handler);
        });
    },

    joinCall: function() {
        chrome.app.window.current().maximize();
        this.$el.find('.features').hide();
        this.$el.find('#uncontained_main_content').show();
        var _me = this;
    },

    showPopup: function(option) {
        $('.error_container').hide();
        $('#menu').hide();
        $('#password-config').hide();
        $('#sso-config').hide();
        $('#congratulations').hide();
        $('#' + option).show();
    },

    resetAllSettings: function() {
        var _me = this;
        chrome.storage.local.clear(function() {
            console.log("All values cleared");
        });
    },

    doShowSetupComplete: function(sEmail) {
        this.showPopup('congratulations');
        $('#congratulations .calendar_go').focus();
    },

    savePasswordConfig : function (event) {
        event.preventDefault();
        var _me = this;
        try {
            var sEmail = $('#password-config .email').val();
            var sPassword = $('#password-config .password').val();
            if (sEmail === '') {
                this.doDisplayError('Please enter a valid username/email address', $('#password-config'));
            } else if (sPassword === '') {
                this.doDisplayError('Please enter a valid password', $('#password-config'));
            } else {
                this.setUserSettings(sEmail, sPassword, function () {
                    _me.setDefaultSettings();
                    chrome.storage.local.set({'settings_setup_type' : 'password'});
                    //_me.doShowSetupComplete(sEmail);
                    _me.initialize();
                }, function (xhr, status, error) {
                    if (error === 'Unauthorized') {
                        _me.doDisplayError('Log-in Failure', $('#password-config'));
                    }
                });
            }
        } catch(e) {
            console.log("error ", e);
        }
    },

    doDisplayError: function(sError, parent) {
        var oErrorNode = parent ? $(parent).find('.error_container') : $('.error_container');
        oErrorNode.html(sError).fadeIn(20).delay(4000).fadeOut(300);
    },

    setDefaultSettings : function() {
    },

    setUserSettings: function(sUsername, sPassword, oSuccessCallback, oFailureCallback) {
        var _me = this;
        chrome.storage.local.set({'username' : sUsername});
        chrome.storage.local.set({'password' : sPassword});
        try {
            $.ajax({
                url: LinkedIn.baseUrl + '/oauth2/token',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                success: function (result, status, xhr) {
                    // Get the user's information
                },
                error: function (xhr, status, error) {
                    oFailureCallback(xhr, status, error);
                },
                cache: false,
                data: '{ "grant_type":"password", "username":"' + sUsername + '", "password":"' + sPassword + '" }'
            });
        } catch(e) {
            console.log("error ", e);
        }
    },
});
});
