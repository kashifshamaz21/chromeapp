  LinkedIn = {
    checkConnectivity: function() {
      var condition = navigator.onLine ? true : false;
      return condition;
    }
  };
  var clientId = '75jmcfi1tpfzxd';
  var clientSecret = 'mvqPSjN8oV9mML3k';
  var redirectUri = 'https://' + chrome.runtime.id +
                    '.chromiumapp.org/provider_cb';
  var redirectRe = new RegExp(redirectUri + '[#\?](.*)');
  var APIScope = 'r_basicprofile r_fullprofile r_emailaddress r_network r_contactinfo rw_nus rw_groups w_messages';

  var access_token = null;
  var APICalls = [];
  var APIVersion = 'v1';
  var JSONformat="&format=json";

  // My Profile and My Data APIS
  APICalls['myProfile'] = 'people/~:(first-name,last-name,headline,picture-url)';
  APICalls['myConnections'] = 'people/~/connections';
  APICalls['myNetworkShares'] = 'people/~/shares';
  APICalls['myNetworksUpdates'] = 'people/~/network/updates';
  APICalls['myNetworkUpdates'] = 'people/~/network/updates?scope=self';

  // PEOPLE SEARCH APIS
  // Be sure to change the keywords or facets accordingly
  APICalls['peopleSearchWithKeywords'] = 'people-search:(people:(id,first-name,last-name,picture-url,headline),num-results,facets)?keywords=Hacker+in+Residence';
  APICalls['peopleSearchWithFacets'] = 'people-search:(people,facets)?facet=location,us:84';

  APICalls['share'] = 'people/~/shares';
  APICalls['shareInfo'] = 'people/~/network/updates/key=';

  // GROUPS APIS
  // Be sure to change the GroupId accordingly
  APICalls['myGroups'] = 'people/~/group-memberships?membership-state=member';
  APICalls['groupSuggestions'] = 'people/~/suggestions/groups';
  APICalls['groupPosts'] = 'groups/12345/posts:(title,summary,creator)?order=recency';
  APICalls['groupDetails'] = 'groups/12345:(id,name,short-description,description,posts)';

  // COMPANY APIS
  // Be sure to change the CompanyId or facets accordingly
  APICalls['myFollowingCompanies'] = 'people/~/following/companies';
  APICalls['myFollowCompanySuggestions'] = 'people/~/suggestions/to-follow/companies';
  APICalls['companyDetails'] = 'companies/1337:(id,name,description,industry,logo-url)';
  APICalls['companySearch'] = 'company-search:(companies,facets)?facet=location,us:84';

  // JOBS APIS
  // Be sure to change the JobId or facets accordingly
  APICalls['myJobSuggestions'] = 'people/~/suggestions/job-suggestions';
  APICalls['myJobBookmarks'] = 'people/~/job-bookmarks';
  APICalls['jobDetails'] = 'jobs/1452577:(id,company:(name),position:(title))';
  APICalls['jobSearch'] = 'job-search:(jobs,facets)?facet=location,us:84';

require(["backbone",
        "jquery",
        "keymaster",
        "underscore",
        "js/views/feed-list-view",
        "js/views/post-update-view",
        "js/views/job-suggestions-view",
        "slimscroll",
        "corgi",
        "bootstrap",
        "conference",
        "socket.io.min",
        "RTCPeerConnection",
        "conf-settings",
        "xml2json"], function(Backbone, $, key, _, 
          FeedListView, ShareNewPost, JobSuggestionsView) {

    var StartUp = Backbone.View.extend({
        el : "body",

    events: {
        'click #signin' : 'interactiveSignIn',
        'click #revoke' : 'revokeToken'

    },
    initialize: function () {
        _.bindAll(this);
        this.feedListView = new FeedListView({
            startUp: this
        });
        this.shareNewPostView = new ShareNewPost({
            startUp: this
        });
        this.jobSuggestionsView = new JobSuggestionsView({
          startUp: this
        });
        $("#slim-scroll-id").slimScroll({
            height: "675px"
        });
        var _me = this;
        this.signin_button = $('#signin');
        this.revoke_button = $('#revoke');
        
        chrome.storage.local.get("access_token" , function(data) {
          access_token = data.access_token;
          if(!access_token) {
            _me.$el.find('.login-frame').show();
            _me.$el.find('.main-page').hide();
            
          } else {
            _me.$el.find('.login-frame').hide();
            _me.$el.find('.main-page').show();            
          }
      });
      window.addEventListener('offline',  function(event){
        _me.updateOnlineStatus(event , _me)
      });
       window.addEventListener('online',  function(event){
        _me.updateOnlineStatus(event , _me)
       });      
      chrome.storage.local.get("access_token" , function(data) {
        access_token = data.access_token;
        if(!access_token) {
          _me.$el.find('.login-frame').show();
          _me.$el.find('.main-page').hide();
          
        } else {
          _me.$el.find('.login-frame').hide();
          _me.$el.find('.main-page').show();            
        }
     });
    },

    updateOnlineStatus : function(event , _me) {
        var condition = navigator.onLine ? "online" : "offline";
        var network_status = $("#network-status");
        if (condition === "online") {
          network_status.hide();
        }else{
          network_status.show();
        }
        _me.getFromChrome("share" , function(pendingShares){
          _me.postShare(pendingShares, function(err , response){
            if (!err) console.log("Pending shares are published!");
          })
        })
    },

    renderUserFeed: function() {
        this.feedListView.render();
    },

    renderPostUpdateView: function () {
        this.shareNewPostView.render();
    },
    renderJobSuggestions: function() {
      this.jobSuggestionsView.render();
    },

  randomState: function(howLong) {
    howLong=parseInt(howLong);
    if (!howLong || howLong<=0) {
      howLong=18;
    }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
    for (var i = 0; i < howLong; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  // Functions updating the User Interface:

  showButton: function(button) {
    button.show();
    button.removeAttr('disabled');
  },

  hideButton: function(button) {
    button.hide();
  },

  disableButton: function(button) {
    button.attr('disabled','disabled');
  },

  onUserInfoFetched: function(error, status, response, callback) {
    if (!error && status == 200) {
      console.log("Got the following user info: " + response);
      var user_info = JSON.parse(response);
      this.populateUserInfo(user_info);
      callback(user_info);
    } else {
      console.log('infoFetch failed', error, status);
      this.showButton(this.signin_button);
    }
  },

  populateUserInfo: function(user_info) {
    this.storeInChrome({"user_info" : user_info});
  },

  storeInChrome: function(object) {
    chrome.storage.local.set(object, function() {
      //callback(null, access_token);
    });
  },

  getFromChrome: function(key , callback) {
      chrome.storage.local.get(key, function(data) {
        callback(data[key])
      });
  },

  fetchUserRepos: function(repoUrl) {
    this.xhrInitialize('GET', repoUrl, false, onUserReposFetched);
  },

  onUserReposFetched: function(error, status, response) {
    var errorlem = document.querySelector('#user_repos');
    elem.value='';
    if (!error && status == 200) {
      console.log("Got the following user repos:", response);
      var user_repos = JSON.parse(response);
      user_repos.forEach(function(repo) {
        if (repo.private) {
          elem.value += "[private repo]";
        } else {
          elem.value += repo.name;
        }
        elem.value += '\n';
      });
    } else {
      console.log('infoFetch failed', error, status);
    }
    
  },

  // Handlers for the buttons's onclick events.

  interactiveSignIn: function() {
    var _me = this;
    this.disableButton(this.signin_button);
    this.getToken(true, function(error, access_token) {
      if (error) {
        this.showButton(this.signin_button);
      } else {
        _me.$el.find('.login-frame').hide();
        _me.$el.find('.main-page').show();
        //getUserInfo(true);
      }
    });
  },

  revokeToken: function() {
    window.open('https://github.com/settings/applications');
    user_info_div.textContent = '';
    this.hideButton(this.revoke_button);
    this.showButton(this.signin_button);
  },

    getUserInfo: function(interactive , callback) {
        var _me = this;
      chrome.storage.local.get("user_info" ,function(data){
        if(data.user_info){
          callback(data.user_info);
        }else{
        var format;
        if (APICalls['myProfile'].indexOf("?") >= 0) {
          format = "&format=json";
        }
        else {
          format = "?format=json";
        }
        var url ='https://api.linkedin.com/v1/' + APICalls['myProfile'] + format;  
        _me.xhrInitialize('GET', url,  interactive, onUserInfoFetched , callback);
        }
      });
    },

    getShareJson : function(shareKey, callback){
        var _me = this;
      if (navigator.onLine) {
        var format;
        if (APICalls['shareInfo'].indexOf("?") >= 0) {
          format = "&format=json";
        }
        else {
          format = "?format=json";
        }
        var url ='https://api.linkedin.com/v1/' + APICalls['shareInfo'] + shareKey + format;  
          this.xhrInitialize('GET', url,  true, function(error, response){
            if (error) {
              callback(error);
            }else{
              var data = JSON.parse(response);
              callback(null , data);
            }
          });
      }else{
        _me.getFromChrome("newPost" , function(newPost){
          callback(null , newPost);
        });
      }
    },

    postShare : function(postData , callback){
        var _me = this;
      var xmlData = '<share>' +
                      '<comment>'+postData.comment +'</comment>' + 
                      '<content>'+
                        '<title>'+postData.title+'</title>'+
                        '<description>'+postData.description +'</description>'+
                        '<submitted-url>'+postData.commentUrl+'</submitted-url>'+
                        '<submitted-image-url>'+postData.imageUrl+'</submitted-image-url>'+ 
                      '</content>'+
                      '<visibility>'+ 
                        '<code>anyone</code>'+ 
                      '</visibility>'+
                    '</share>';
      if (navigator.onLine) {
        if (APICalls['share'].indexOf("?") >= 0) {
          format = "&format=xml";
        }
        else {
          format = "?format=xml";
        }
        var url ='https://api.linkedin.com/v1/' + APICalls['share'] + format;  
          _me.xhrInitialize('POST', url,  false, function(error, response){
            if (error) {
              callback(error);
            }else{
              var data = $.parseXML(response);
              callback(null , $(data).find("update-key").text());
            }
          },xmlData);
      }else{
        _me.storeInChrome({"share" : xmlData});
      }
    },

    getJobSuggestions : function(callback){
      var _me = this;
      if (navigator.onLine) {
        var format;
        if (APICalls['myJobSuggestions'].indexOf("?") >= 0) {
          format = "&format=json";
        }
        else {
          format = "?format=json";
        }
        var url ='https://api.linkedin.com/v1/' + APICalls['myJobSuggestions'] + format;  
          _me.xhrInitialize('GET', url,  false, function(error, response){
            if (error) {
              callback(error);
            }else{
              var data = JSON.parse(response);
              callback(null , data);

              _me.storeInChrome({"job-suggestions" : data});
            }
          });
      }else{
        _me.getFromChrome("myJobSuggestions" , function(jobs){
          callback(null , jobs);
        });
      }
    },

    getFeeds : function(callback){
        var _me = this;
      if (navigator.onLine) {
        var format;
        if (APICalls['myNetworksUpdates'].indexOf("?") >= 0) {
          format = "&format=json";
        }
        else {
          format = "?format=json";
        }
        var url ='https://api.linkedin.com/v1/' + APICalls['myNetworksUpdates'] + format;  
          this.xhrInitialize('GET', url,  true, function(error, response){
            if (error) {
              callback(error);
            }else{
              var data = JSON.parse(response);
              callback(null , data);
              _me.storeInChrome({"feeds" : data});
            }
          });
      }else{
        _me.getFromChrome("feeds" , function(feeds){
          callback(null , feeds);
        });
      }
    },

    getConnections : function(callback){
        var _me = this;
        if (navigator.onLine) {
        var format;
        if (APICalls['myConnections'].indexOf("?") >= 0) {
          format = "&format=json";
        }
        else {
          format = "?format=json";
        }
        var url ='https://api.linkedin.com/v1/' + APICalls['myConnections'] + format;  
          this.xhrInitialize('GET', url,  interactive, function(error, status, response){
            if (error) {
              callback(error);
            }else{
              var data = JSON.parse(response);
              callback(null , data);

              _me.storeInChrome({"connections" : data});
            }
          });
      }else{
        _me.getFromChrome("connections" , function(connections){
          callback(null , connections);
        });
      }
    },
      getToken: function(interactive, callback) {
        var _me = this;
        var options = {
          'interactive': interactive,
          url:'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' + clientId +
              '&scope='+APIScope +
              '&state=RNDM_' + this.randomState(18) +
              '&redirect_uri=' + encodeURIComponent(redirectUri)
        };

        // In case we already have an access_token cached, simply return it.
        chrome.storage.local.get("access_token" , function(data){
          access_token = data.access_token;
          if (!access_token) {
            chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
              console.log('launchWebAuthFlow completed', chrome.runtime.lastError,
                  redirectUri);

              if (chrome.runtime.lastError) {
                callback(new Error(chrome.runtime.lastError));
                return;
              }
              var matches = redirectUri.match(redirectRe);
              if (matches && matches.length > 1)
                _me.handleProviderResponse(_me.parseRedirectFragment(matches[1]), callback);
              else
                callback(new Error('Invalid redirect URI'));
            });
          }else{
            callback(null, access_token);
          }
        });
      },


      parseRedirectFragment: function(fragment) {
          var pairs = fragment.split(/&/);
          var values = {};

          pairs.forEach(function(pair) {
            var nameval = pair.split(/=/);
            values[nameval[0]] = nameval[1];
          });

          return values;
      },

      handleProviderResponse: function(values, callback) {
          console.log('providerResponse', values);
          if (values.hasOwnProperty('access_token'))
            this.setAccessToken(values.access_token, callback);
          // If response does not have an access_token, it might have the code,
          // which can be used in exchange for token.
          else if (values.hasOwnProperty('code'), callback)
            this.exchangeCodeForToken(values.code, callback);
          else 
            callback(new Error('Neither access_token nor code avialable.'));
      },

      exchangeCodeForToken: function(code, callback) {
          var xhr = new XMLHttpRequest();
          var _me = this;
          xhr.open('GET',
                   'https://www.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code&' +
                   'client_id=' + clientId +
                   '&client_secret=' + clientSecret +
                   '&redirect_uri=' + redirectUri +
                   '&code=' + code);
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.onload = function () {
            // When exchanging code for token, the response comes as json, which
            // can be easily parsed to an object.
            if (this.status === 200) {
              var response = JSON.parse(this.responseText);
              console.log(response);
              if (response.hasOwnProperty('access_token')) {
                _me.setAccessToken(response.access_token, callback);
              } else {
                callback(new Error('Cannot obtain access_token from code.'));
              }
            } else {
              console.log('code exchange status:', this.status);
              callback(new Error('Code exchange failed'));
            }
          };
          xhr.send();
      },

      setAccessToken: function(token, callback) {
            var _me = this;
          chrome.storage.local.set({'access_token': token}, function() {
            console.log('access_token saved');
            callback(null, token);
          });
      },

      removeCachedToken: function(token_to_remove) {
        if (access_token == token_to_remove)
          access_token = null;
      },
    xhrInitialize: function(method, url, interactive, callback , postData) {
        this.retry = true;
        access_token = null;
        this.method = method;
        this.url = url;
        this.interactive = interactive;
        this.callback = callback;
        this.postData = postData;
        console.log('xhrInitialize', method, url, interactive);
        this.xhrGetToken();   
    },
    
    xhrGetToken: function(callback) {
        var _me = this;
      this.getToken(this.interactive, function(error, token) {
        console.log('token fetch', error, token);
        if (error) {
          callback(error);
          return;
        }
        access_token = token;

        var finalUrl;
        if (_me.url.indexOf("?") === -1) {
            finalUrl = _me.url + "?oauth2_access_token=" + token;
        }else{
            finalUrl = _me.url + "&oauth2_access_token=" + token;
        }
        _me.requestStart(finalUrl);

      });
    },

    requestStart: function(finalUrl) {
      var _me = this;
      _me.xhr = new XMLHttpRequest();
      _me.xhr.open(this.method, finalUrl);
      if (this.method === "POST") {
        _me.xhr.setRequestHeader('content-type', 'application/xml');
      }
      _me.xhr.onload = this.requestComplete;
      if (_me.postData) {
        _me.xhr.send(_me.postData);
      }else{
        _me.xhr.send();
      }
    },

    requestComplete: function(e) {
      console.log('requestComplete', this.xhr.status, this.xhr.response);
        if (this.xhr.status >199 && 300 > this.xhr.status) {
        this.callback(null , this.xhr.response);            
        };

    },

   renderUserFeed: function() {
        this.feedListView.render();
    }

});

    $(document).ready(function() {
        var startUp = new StartUp();
        startUp.renderPostUpdateView();
        startUp.renderUserFeed();
        startUp.renderJobSuggestions();
    });
});
