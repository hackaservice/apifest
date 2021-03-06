/**
 * Created by egacl on 08-06-15.
 */

angular.module('versu.login', [])

.controller('LoginCtrl', function($scope, $state, TwitterService, UserTwitterService, $ionicHistory){
    //se limpia el historial
    $ionicHistory.clearHistory();
    $scope.showLoginButton = false;

    $scope.userLoginData = {};

    var doLogin = function () {
        UserTwitterService.initialization(function (loginData, userData) {
            console.log('login: se recupera info de usuario: ' + loginData + ' / ' + userData);
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.home');
        });
    };

    $scope.verifyLogin = function() {
        $scope.showLoginButton = true;
        if(TwitterService.getStoredToken()!==null) {
            $scope.showLoginButton = false;
            doLogin();
        }
        else {
            $scope.showLoginButton = true;
            console.log('Usuario debe autenticarse antes de entrar a la app');
        };
    };

    $scope.login = function() {
        doLogin();
    };

    $scope.otherLogin = function() {
        console.log($scope.userLoginData.username + ' usuario chanta entrando!');
        TwitterService.setOtherUser($scope.userLoginData.username);
        $state.go('app.home');
    };
})