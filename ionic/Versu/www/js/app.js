// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter',
    [   'ionic',
        'ngResource',
        'ngCordova',
        'twitterApi',
        'versu.login',
        'versu.services',
        'versu.controllers',
        'socket.services',
        'ngSanitize',
        'btford.socket-io',
        'versus.directives',
        'angularMoment'
    ]
)

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'MainCtrl'
    })

    .state('app.home', {
        url: "/home",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/home.html",
                controller: 'HomeCtrl'
            }
        }
    })

      /*
    .state('app.chat', {
        url: "/chat/:nickname",
        views: {
            'menuContent': {
                templateUrl: "templates/chat.html",
                controller: 'ChatController'
            }
        }
    })
    */

    .state('app.versuchat', {
      url: "/versuchat/:topic",
      cache: false,
      views: {
          'menuContent': {
              templateUrl: "templates/versu_chat.html",
              controller: 'VersuTopicChat'
          }
      }
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent': {
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    });

    $urlRouterProvider.otherwise('/login');
})

;
