/**
 * Created by egacl on 07-06-15.
 */
angular.module('twitterApi', [])

.factory('TwitterService', function($cordovaOauth, $cordovaOauthUtility, $http, $resource, $q) {
    // 1
    var twitterKey = "STORAGE.TWITTER.NEW_KEY";
    //var clientId = 'XiATofvGofwNFUvBb8tSwY0cG';
    //var clientId = 'vYzBSm5uy3sSlsWpBDpOcZduI';

    //var clientSecret = 'zMgQ9Yw6awSkxTj08DyVa95HZVs46rohGPkc2GJuKEbW5XTEJh';
    //var clientSecret = 'l0jtq58413gC0RSRWymNcwPUpIql5sjZEVtqefJ7zDjuFXPkWm';

    var clientId = '79q7CmbVzEkP2kPGk9IgN4kuE';
    var clientSecret = 'wRRQ99oqH1TaXCiBZHsHa2Ii7CQOsCsjtvSV1i9SsXUPJ9QuJ2';

            // 2
    function storeUserToken(data) {
        window.localStorage.setItem(twitterKey, JSON.stringify(data));
    };

    function getStoredToken() {
        return window.localStorage.getItem(twitterKey);
    };

    // 3
    function createTwitterSignature(method, url) {
        var token = angular.fromJson(getStoredToken());
        var oauthObject = {
            oauth_consumer_key: clientId,
            oauth_nonce: $cordovaOauthUtility.createNonce(32),
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_token: token.oauth_token,
            oauth_version: "1.0"
        };
        var signatureObj = $cordovaOauthUtility.createSignature(method, url, oauthObject, {}, clientSecret, token.oauth_token_secret);
        $http.defaults.headers.common.Authorization = signatureObj.authorization_header;
    };

    function createTwitterGetUserProfileSignature(method, url) {
        var token = angular.fromJson(getStoredToken());
        var oauthObject = {
            oauth_consumer_key: clientId,
            oauth_nonce: $cordovaOauthUtility.createNonce(32),
            oauth_signature_method: "HMAC-SHA1",
            oauth_token: token.oauth_token,
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_version: "1.0"
        };

        var signatureObj = $cordovaOauthUtility.createSignature(method, url,
            oauthObject,{screen_name:token.screen_name}, clientSecret,
            token.oauth_token_secret);

        $http.defaults.headers.common.Authorization =
            signatureObj.authorization_header;
    };

    function createTwitterPostSignature(method, url, message) {
        var token = angular.fromJson(getStoredToken());
        var oauthObject = {
            oauth_consumer_key: clientId,
            oauth_nonce: $cordovaOauthUtility.createNonce(32),
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_token: token.oauth_token,
            oauth_version: "1.0",
            status: message
        };
        var signatureObj = $cordovaOauthUtility.createSignature(method, url, oauthObject, oauthObject, clientSecret, token.oauth_token_secret);
        $http.defaults.headers.common.Authorization = signatureObj.authorization_header;
    };

    //this.$get = function () {
    return {
        // 4
        initialize: function () {
            var deferred = $q.defer();
            var token = getStoredToken();
            if (token !== null) {
                deferred.resolve(true);
            } else {
                $cordovaOauth.twitter(clientId, clientSecret).then(function (result) {
                    storeUserToken(result);
                    deferred.resolve(true);
                }, function (error) {
                    deferred.reject(false);
                });
            }
            return deferred.promise;
        },
        // 5
        isAuthenticated: function () {
            return getStoredToken() !== null;
        },
        // 6
        getHomeTimeline: function () {
            var home_tl_url = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
            createTwitterSignature('GET', home_tl_url);
            return $resource(home_tl_url).query().$promise;
        },
        updateStatus: function () {
            var message = "test from ionic";
            var update_url = 'https://api.twitter.com/1.1/statuses/update.json';
            var results = createTwitterPostSignature('POST', update_url, message);
            return $resource(update_url, {'status': message}).save().$promise;
        },
        getTwitterProfile: function () {
            // Get user profile from Twitter API
            var deferred = $q.defer();
            var token = angular.fromJson(getStoredToken());

            createTwitterGetUserProfileSignature('GET',
                'https://api.twitter.com/1.1/users/show.json');

            $http.get("https://api.twitter.com/1.1/users/show.json",
                {params: { screen_name: token.screen_name}})
                .success(function (result) {
                    console.log('Service: Se recibe respuesta de datos de perfil de twitter: ' + result);
                    deferred.resolve(result);
                })
                .error(function (error) {
                    console.log('Service: Error al solicitar datos de perfil de usuario: ' + error);
                    alert("There was a problem getting your profile");
                    deferred.reject(false);
                });
            return deferred.promise;
        },
        storeUserToken: storeUserToken,
        getStoredToken: getStoredToken,
        createTwitterSignature: createTwitterSignature,
        createTwitterPostSignature: createTwitterPostSignature
    };
    //};
})