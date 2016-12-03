var dannenhauerComm = dannenhauerComm || {};
dannenhauerComm.controllers = angular.module('dannenhauerCommControllers', ['ngRoute']);
var controls = dannenhauerComm.controllers;

controls.controller('RootCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.loghello = function() {
        log("hello");
    };
}]);

controls.controller('ProfileCtrl', ['$scope', function ($scope) {

}]);

controls.controller('LoginCtrl', ['$scope', 'firebaseService', function ($scope, firebaseService) {
       
    $scope.loadFirebaseLoginOptions = function() {
        firebaseService.loadFirebaseLoginUi("firebaseui-auth-container");
    };

    $scope.loadFirebaseLoginOptions();

}]);
