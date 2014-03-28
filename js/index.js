var linkedinApis = (function() {
  'use strict';
  
  var signin_button;
  var revoke_button;
  var user_info_div;
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

  var RandomState = function(howLong) {
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
  }
  var tokenFetcher = (function() {
    return {
      getToken: function(interactive, callback) {
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

              // Upon success the response is appended to redirectUri, e.g.
              // https://{app_id}.chromiumapp.org/provider_cb#access_token={value}
              //     &refresh_token={value}
              // or:
              // https://{app_id}.chromiumapp.org/provider_cb#code={value}
              var matches = redirectUri.match(redirectRe);
              if (matches && matches.length > 1)
                handleProviderResponse(parseRedirectFragment(matches[1]));
              else
                callback(new Error('Invalid redirect URI'));
            });
          }else{
            callback(null, access_token);
          }
        });

        var options = {
          'interactive': interactive,
          url:'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' + clientId +
              '&scope='+APIScope +
              '&state=RNDM_' + RandomState(18) +
              '&redirect_uri=' + encodeURIComponent(redirectUri)
        }

        function parseRedirectFragment(fragment) {
          var pairs = fragment.split(/&/);
          var values = {};

          pairs.forEach(function(pair) {
            var nameval = pair.split(/=/);
            values[nameval[0]] = nameval[1];
          });

          return values;
        }

        function handleProviderResponse(values) {
          console.log('providerResponse', values);
          if (values.hasOwnProperty('access_token'))
            setAccessToken(values.access_token);
          // If response does not have an access_token, it might have the code,
          // which can be used in exchange for token.
          else if (values.hasOwnProperty('code'))
            exchangeCodeForToken(values.code);
          else 
            callback(new Error('Neither access_token nor code avialable.'));
        }

        function exchangeCodeForToken(code) {
          var xhr = new XMLHttpRequest();
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
                setAccessToken(response.access_token);
              } else {
                callback(new Error('Cannot obtain access_token from code.'));
              }
            } else {
              console.log('code exchange status:', this.status);
              callback(new Error('Code exchange failed'));
            }
          };
          xhr.send();
        }

        function setAccessToken(token) {
          chrome.storage.local.set({'access_token': token}, function() {
            message('access_token saved');
            callback(null, access_token);
          });
        }
      },

      removeCachedToken: function(token_to_remove) {
        if (access_token == token_to_remove)
          access_token = null;
      }
    }
  })();

  function xhrWithAuth(method, url, interactive, callback , callbackEXt) {
    var retry = true;
    var access_token;

    console.log('xhrWithAuth', method, url, interactive);
    getToken();

    function getToken() {
      tokenFetcher.getToken(interactive, function(error, token) {
        console.log('token fetch', error, token);
        if (error) {
          callback(error);
          return;
        }
        access_token = token;
        var finalUrl = url + "&oauth2_access_token=" + token
        requestStart(finalUrl);
      });
    }

    function requestStart(finalUrl) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, finalUrl);
      //xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      xhr.onload = requestComplete;
      xhr.send();
    }

    function requestComplete() {
      console.log('requestComplete', this.status, this.response);
      if ( ( this.status < 200 || this.status >=300 ) && retry) {
        retry = false;
        tokenFetcher.removeCachedToken(access_token);
        access_token = null;
        getToken();
      } else {
        callback(null, this.status, this.response , callbackEXt);
      }
    }
  }

  // Functions updating the User Interface:

  function showButton(button) {
    button.style.display = 'inline';
    button.disabled = false;
  }

  function hideButton(button) {
    button.style.display = 'none';
  }

  function disableButton(button) {
    button.disabled = true;
  }

  function onUserInfoFetched(error, status, response, callback) {
    if (!error && status == 200) {
      console.log("Got the following user info: " + response);
      var user_info = JSON.parse(response);
      populateUserInfo(user_info);
      callback(user_info);
    } else {
      console.log('infoFetch failed', error, status);
      showButton(signin_button);
    }
  }

  function populateUserInfo(user_info) {
    storeInChrome({"user_info" : user_info});
  }

  function storeInChrome (object) {
    chrome.storage.local.set(object, function() {
      //callback(null, access_token);
    });
  }

  function getFromChrome (key) {
      chrome.storage.local.get(key, function(data) {
        callback(data[key])
      });
  }

  function fetchUserRepos(repoUrl) {
    xhrWithAuth('GET', repoUrl, false, onUserReposFetched);
  }

  function onUserReposFetched(error, status, response) {
    var elem = document.querySelector('#user_repos');
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
    
  }

  // Handlers for the buttons's onclick events.

  function interactiveSignIn() {
    disableButton(signin_button);
    tokenFetcher.getToken(true, function(error, access_token) {
      if (error) {
        showButton(signin_button);
      } else {
        //getUserInfo(true);
      }
    });
  }

  function revokeToken() {
    window.open('https://github.com/settings/applications');
    user_info_div.textContent = '';
    hideButton(revoke_button);
    showButton(signin_button);
  }

  return {
    getUserInfo : function(interactive , callback) {
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
        xhrWithAuth('GET', url,  interactive, onUserInfoFetched , callback);
        }
      });
    },
    getJobSuggestions : function(callback){
      if (navigator.onLine) {
        var format;
        if (APICalls['myJobSuggestions'].indexOf("?") >= 0) {
          format = "&format=json";
        }
        else {
          format = "?format=json";
        }
        var url ='https://api.linkedin.com/v1/' + APICalls['myJobSuggestions'] + format;  
          xhrWithAuth('GET', url,  interactive, function(error, status, response){
            if (error) {
              callback(error);
            }else{
              var data = JSON.parse(response);
              callback(null , data);

              storeInChrome({"job-suggestions" : data});
            }
          });
      }else{
        getFromChrome("myJobSuggestions" , function(jobs){
          callback(null , jobs);
        });
      }
    },
        
    getFeeds : function(callback){
      if (navigator.onLine) {
        var format;
        if (APICalls['myNetworksUpdates'].indexOf("?") >= 0) {
          format = "&format=json";
        }
        else {
          format = "?format=json";
        }
        var url ='https://api.linkedin.com/v1/' + APICalls['myNetworksUpdates'] + format;  
          xhrWithAuth('GET', url,  interactive, function(error, status, response){
            if (error) {
              callback(error);
            }else{
              var data = JSON.parse(response);
              callback(null , data);

              storeInChrome({"feeds" : data});
            }
          });
      }else{
        getFromChrome("feeds" , function(feeds){
          callback(null , feeds);
        });
      }
    },

    getConnections : function(callback){
        if (navigator.onLine) {
        var format;
        if (APICalls['myConnections'].indexOf("?") >= 0) {
          format = "&format=json";
        }
        else {
          format = "?format=json";
        }
        var url ='https://api.linkedin.com/v1/' + APICalls['myConnections'] + format;  
          xhrWithAuth('GET', url,  interactive, function(error, status, response){
            if (error) {
              callback(error);
            }else{
              var data = JSON.parse(response);
              callback(null , data);

              storeInChrome({"connections" : data});
            }
          });
      }else{
        getFromChrome("connections" , function(connections){
          callback(null , connections);
        });
      }
    },
    
    onload: function () {
      signin_button = document.querySelector('#signin');
      signin_button.onclick = interactiveSignIn;

      revoke_button = document.querySelector('#revoke');
      revoke_button.onclick = revokeToken;

      user_info_div = document.querySelector('#user_info');

      console.log(signin_button, revoke_button, user_info_div);

      showButton(signin_button);
      //getUserInfo(false);
    }
  };
})();


window.onload = linkedinApis.onload;