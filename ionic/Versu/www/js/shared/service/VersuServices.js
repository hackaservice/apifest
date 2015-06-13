/**
 * Created by egacl on 07-06-15.
 */

angular.module('versu.services', [])

.factory('TopicsService', function($http){

})

.factory('TopicService', function($http) {
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

    return {
        getTopics : function() {
            return topics;
        }
    };
})

.factory('UserTwitterService', function($http, TwitterService) {
    var userTwitterData = {};

    var twitterLoginData = {};

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
                if (TwitterService.isAuthenticated() == true) {
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
                }
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