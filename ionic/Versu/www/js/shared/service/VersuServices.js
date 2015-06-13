/**
 * Created by egacl on 07-06-15.
 */

angular.module('versu.services', [])

.factory('TopicsService', function($http){

})

.factory('TopicService', function($http) {
        var URL_PAGE = 'http://54.207.124.107';
        //var URL_PAGE = 'http://146.155.116.26:3000';

    var topics = [
        {
            topic : "#CopaAmerica2015",
            topic_image_url : "https://pbs.twimg.com/profile_images/3353691648/1396793a016a5c5d9d87355fddc07793.jpeg",
            topic_data : {
                text : "Detrás de Orpis está el poderoso grupo Angelini. De Gajardo, solo un Estado en situación de discapacidad."
            }
        }
        ,
        {
            topic : "#YaEsMuyNormalQue",
            topic_image_url : "https://pbs.twimg.com/media/CHJqKHFUgAA08vI.png",
            topic_data : {
                text : "#YaEsMuyNormalQue mi mamá sea mi vocera :P"
            }
        }
        ,
        {
            topic : "#PartyChilensisJebus",
            topic_image_url : "https://pbs.twimg.com/media/CHKnXqVWcAE0LJw.jpg",
            topic_data : {
                text : "youtube.com/watch?v=7W8hfLdJoE8 … #PartyChilensisJebus VACILEMOS EIRN FANNN LIBIN IN DE RIAL GUORLD!!!!!"
            }
        }
        ,
        {
            topic : "#menospifiasmasgoles",
            topic_image_url : "https://pbs.twimg.com/media/CHLVit5W4AAJthP.jpg",
            topic_data : {
                text : "#menospifiasmasgoles es ahora una tendencia en Chile http://trendsmap.com/cl "
            }
        }
        ];

        function getTopics(userTwitterData, callback) {
            $http.post(URL_PAGE + '/listTopics').then(function(response){
                callback(response.data);
            });
        }

    return {
        getTopics : function(userTwitterData, callback) {
            return getTopics(userTwitterData, callback);
        }
    };
})

.factory('UserTwitterService', function($http, TwitterService) {
    var userTwitterData = {
        id: "14924202",
        id_str: "14924202",
        name: "Eugenio Contreras",
        screen_name: "egacl",
        location: "Chile",
        profile_location: null,
        description: "Ingeniero en Informática amante del desarrollo de software de calidad, metodologías ágiles y el deporte!!!",
        url: "http://t.co/D8whfA8PKj",
        entities: {
            url: {
                urls: [
                    {
                        url: "http://t.co/D8whfA8PKj",
                        expanded_url: "http://getgeeks.blogspot.com",
                        display_url: "getgeeks.blogspot.com",
                        indices: [
                            0,
                            22
                        ]
                    }
                ]
            },
            description: {
                urls: []
            }
        },
        protected: false,
        followers_count: 134,
        friends_count: 70,
        listed_count: 3,
        created_at: "Tue May 27 19:05:12 +0000 2008",
        favourites_count: 6,
        utc_offset: -14400,
        time_zone: "Santiago",
        geo_enabled: true,
        verified: false,
        statuses_count: 2866,
        lang: "en",
        status: {
            created_at: "Sun Jun 07 16:08:00 +0000 2015",
            id: 607579772563124200,
            id_str: "607579772563124224",
            text: "test from ionic",
            source: "<a href=\"http://www.secret.cl\" rel=\"nofollow\">secretappExample</a>",
            truncated: false,
            in_reply_to_status_id: null,
            in_reply_to_status_id_str: null,
            in_reply_to_user_id: null,
            in_reply_to_user_id_str: null,
            in_reply_to_screen_name: null,
            geo: null,
            coordinates: null,
            place: null,
            contributors: null,
            retweet_count: 0,
            favorite_count: 0,
            entities: {
                hashtags: [],
                symbols: [],
                user_mentions: [],
                urls: []
            },
            favorited: false,
            retweeted: false,
            lang: "en"
        },
        contributors_enabled: false,
        is_translator: false,
        is_translation_enabled: false,
        profile_background_color: "9EB1BC",
        profile_background_image_url: "http://pbs.twimg.com/profile_background_images/66948307/shiny-silver.jpg",
        profile_background_image_url_https: "https://pbs.twimg.com/profile_background_images/66948307/shiny-silver.jpg",
        profile_background_tile: true,
        profile_image_url: "http://pbs.twimg.com/profile_images/2452446582/2pw9krhoy6arznebvwb2_normal.jpeg",
        profile_image_url_https: "https://pbs.twimg.com/profile_images/2452446582/2pw9krhoy6arznebvwb2_normal.jpeg",
        profile_link_color: "9EB1BC",
        profile_sidebar_border_color: "C2D4E0",
        profile_sidebar_fill_color: "C2D4E0",
        profile_text_color: "000000",
        profile_use_background_image: true,
        default_profile: false,
        default_profile_image: false,
        following: false,
        follow_request_sent: false,
        notifications: false,
        suspended: false,
        needs_phone_verification: false
    };

    var twitterLoginData = {
        oauth_token:"14924202-FUPJYDuIpDdJgZnxpeC5MhN0ZdpKK2Xz7k9hpoU0n",
        oauth_token_secret:"kxBMXqJctDflXQ7d9EE494uPspqQAViWETQorhJNykRQ6",
        user_id:"14924202",
        screen_name:"egacl",
        x_auth_expires:"0"
    };

    var getTwitterUserProfile = function(callback) {
        //Se obtienen los datos del perfil del usuario en twitter
        console.log('VersuService: Se obitenen los datos del perfil del usuario');
        TwitterService.getTwitterProfile().then(function (resUserData){
            console.log('VersuService: Se obtiene el perfil de usuario de twitter: ' + resUserData);
            userTwitterData = resUserData;
            callback(twitterLoginData, userTwitterData);
            return;
        });
    };

    //this.$get = function () {
        return {
            initialization: function (callback) {
                //Se autentica el usuario en twitter
                /*if (TwitterService.isAuthenticated() == true) {
                    console.log('VersuService: El usuario ya se encuentra logeado en twitter');
                    twitterLoginData = TwitterService.getStoredToken();
                    getTwitterUserProfile(callback);
                }
                else {
                    console.log('VersuService: El usuario se debe autenticar en twitter');
                    TwitterService.initialize().then(function (result) {
                        console.log('VersuService: respuesta de login de usuario en twitter: ' + result);
                        if (result === true) {
                            twitterLoginData = TwitterService.getStoredToken();
                            getTwitterUserProfile(callback);
                        }
                    });
                }*/
            },
            getTwitterUserData: function () {
                return userTwitterData;
            },
            getTwitterLoginData: function () {
                return twitterLoginData;
            }
        };
    //};
})