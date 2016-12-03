var dannenhauerComm = dannenhauerComm || {};
dannenhauerComm.controllers = angular.module('dannenhauerCommControllers', ['ngRoute']);
var controls = dannenhauerComm.controllers;

controls.controller('RootCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.loghello = function() {
       
    };
}]);

controls.controller('ProfileCtrl', ['$scope', function ($scope) {

}]);

controls.controller('LoginCtrl', ['$scope', 'googleService', function ($scope, googleService) {

}]);


