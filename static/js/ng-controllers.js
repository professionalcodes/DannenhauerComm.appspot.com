var dannenhauerComm = dannenhauerComm || {};
dannenhauerComm.controllers = angular.module('dannenhauerCommControllers', ['ngRoute']);
var controls = dannenhauerComm.controllers;

controls.controller('RootCtrl', ['$scope', '$location', function ($scope, $location) {
    
    $scope.loghello = function() {
        log("root controller loaded");
    };

    $scope.loghello();
    
}]);

controls.controller('ProfileCtrl', ['$scope', function ($scope) {
    
}]);

controls.controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.welcome = "hello there sir";

    $scope.onload = function() {
        log("login controller loaded");
    };

    $scope.onload();

}]);

controls.controller('GoogleCtrl', ['$scope', function ($scope) {
    
    $scope.onload = function() {
        log("google controller loaded");
    };

    $scope.onload();

}]);

