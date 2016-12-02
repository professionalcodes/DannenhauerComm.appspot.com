var dannenhauerComm = dannenhauerComm || {};
dannenhauerComm.controllers = angular.module('dannenhauerCommControllers', ['ngRoute']);
var controls = dannenhauerComm.controllers;

controls.controller('RootCtrl', ['$scope', '$location', function ($scope, $location) {
  

}])

controls.controller('SocialMediaLoginCtrl', ['$scope', function ($scope) {
    
    $scope.google = function (argument) {
        // body...
    };

    $scope.facebook = function (argument) {
        // body...
    };

    $scope.github = function (argument) {
        // body...
    };

}])


