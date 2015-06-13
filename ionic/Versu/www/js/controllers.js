angular.module('versu.controllers', [])

    .controller('MainCtrl', function ($scope, $rootScope, $state, $ionicModal, $timeout, UserTwitterService) {
        $scope.twitterUserData = UserTwitterService.getTwitterUserData();
        $scope.loginData = UserTwitterService.getTwitterLoginData();

        console.log(JSON.stringify($scope.loginData, null, 4));
        console.log(JSON.stringify($scope.twitterUserData, null, 4));

        $scope.selectedTopics = [];

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/configuration.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeConfiguration = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.viewConfiguration = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.saveConfiguration = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeConfiguration();
            }, 1000);
        };
    })





    .controller('HomeCtrl', function ($scope, $rootScope, $ionicPlatform, $state, UserTwitterService, TopicService) {

        $scope.twitterUserData = UserTwitterService.getTwitterUserData();
        $scope.loginData = UserTwitterService.getTwitterLoginData();

        $scope.getTopics = function() {
            TopicService.getTopics($scope.twitterUserData, function(response) {
                console.log(response);
                return response;
            });
        };

        $scope.enterSearch = function() {
            console.log('Se redirige a search');
            //app.chat/:nickname
            $state.go('app.search');
        }

        $scope.enterTopic = function() {
            console.log('Se redirige a chat: ' + $scope.twitterUserData.screen_name);
            //app.chat/:nickname
            $state.go('app.chat', {nickname : $scope.twitterUserData.screen_name});
        }

    })






    .controller('ChatController',function($scope, $stateParams, socket, $sanitize, $ionicScrollDelegate, $timeout, $ionicPlatform) {
        console.log('Se inicia chat controller');
        var typing = false;
        var lastTypingTime;
        var TYPING_TIMER_LENGTH = 400;

        //Add colors
        var COLORS = [
            '#e21400', '#91580f', '#f8a700', '#f78b00',
            '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
            '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
        ];

        //initializing messages array
        $scope.messages=[];
        $scope.connected = false;
        $scope.number_message = 0;
        $scope.draft = {message : ""};

        function initSuscription() {
            $scope.connected = true;
            $scope.messages=[];
            $scope.number_message = 0;
            $scope.draft = {message : ""};

            console.log('conectado al salon de chat');

            //Add user
            socket.emit('add user', $stateParams.nickname);

            // On login display welcome message
            socket.on('login', function (data) {
                console.log('login');
                //Set the value of connected flag
                $scope.connected = true;
                $scope.number_message= message_string(data.numUsers);

            });

            // Whenever the server emits 'new message', update the chat body
            socket.on('new message', function (data) {
                console.log('new message');
                if(data.message&&data.username)
                {
                    addMessageToList(data.username,true,data.message);
                }
            });

            // Whenever the server emits 'user joined', log it in the chat body
            socket.on('user joined', function (data) {
                console.log('user joined');
                addMessageToList("",false,data.username + " joined");
                addMessageToList("",false,message_string(data.numUsers));
            });

            // Whenever the server emits 'user left', log it in the chat body
            socket.on('user left', function (data) {
                console.log('user left');
                addMessageToList("",false,data.username+" left");
                addMessageToList("",false,message_string(data.numUsers));
            });

            //Whenever the server emits 'typing', show the typing message
            socket.on('typing', function (data) {
                console.log('typing');
                addChatTyping(data);
            });

            // Whenever the server emits 'stop typing', kill the typing message
            socket.on('stop typing', function (data) {
                console.log('stop typing');
                removeChatTyping(data.username);
            });
        }

        $ionicPlatform.onHardwareBackButton(function() {
            console.log('Se quitan los listeners de socket.io');
            socket.removeAllListeners('stop typing');
            socket.removeAllListeners('typing');
            socket.removeAllListeners('user left');
            socket.removeAllListeners('user joined');
            socket.removeAllListeners('new message');
            socket.removeAllListeners('login');
        });

        initSuscription();

        //function called when user hits the send button
        $scope.sendMessage=function(){
            console.log('contenido del mensaje: ' + $scope.draft.message);
            socket.emit('new message', $scope.draft.message);
            addMessageToList($stateParams.nickname,true,$scope.draft.message);
            socket.emit('stop typing');
            $scope.draft.message = "";
        }

        //function called on Input Change
        $scope.updateTyping=function(){
            sendUpdateTyping();
        }

        // Display message by adding it to the message list
        function addMessageToList(username,style_type,message){
            username = $sanitize(username);
            removeChatTyping(username);
            var color = style_type ? getUsernameColor(username) : null;
            $scope.messages.push({content:$sanitize(message),style:style_type,username:username,color:color});
            $ionicScrollDelegate.scrollBottom();
        }

        //Generate color for the same user.
        function getUsernameColor (username) {
            // Compute hash code
            var hash = 7;
            for (var i = 0; i < username.length; i++) {
                hash = username.charCodeAt(i) + (hash << 5) - hash;
            }
            // Calculate color
            var index = Math.abs(hash % COLORS.length);
            return COLORS[index];
        }

        // Updates the typing event
        function sendUpdateTyping(){
            if($scope.connected){
                if (!typing) {
                    typing = true;
                    socket.emit('typing');
                }
            }
            lastTypingTime = (new Date()).getTime();
            $timeout(function () {
                var typingTimer = (new Date()).getTime();
                var timeDiff = typingTimer - lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                    socket.emit('stop typing');
                    typing = false;
                }
            }, TYPING_TIMER_LENGTH)
        }

        // Adds the visual chat typing message
        function addChatTyping (data) {
            addMessageToList(data.username,true," is typing");
        }

        // Removes the visual chat typing message
        function removeChatTyping (username) {
            $scope.messages = $scope.messages.filter(function(element){return element.username != username || element.content != " is typing"});
        }

        // Return message string depending on the number of users
        function message_string(number_of_users)
        {
            return number_of_users === 1 ? "there's 1 participant":"there are " + number_of_users + " participants";
        }
    })
