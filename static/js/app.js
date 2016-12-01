'use strict';

var app = angular.module('dannenhauerComm', ['dannenhauerCommControllers', 'ngRoute']);

/* routing configuration for production */
var routeConfig = function($routeProvider) {
    $routeProvider
    .when('/about', {
        templateUrl: "/views/about.html",
        controller: "AboutCtrl"
    })
    .when('/contact', {
        templateUrl: "/views/contact.html",
        controller: "ContactCtrl"
    })
    .when('/signup', {
        templateUrl: "/views/signup.html",
        controller: "SignupCtrl"
    })
    .when('/login', {
        templateUrl: "/views/login.html",
        controller: "LoginCtrl"
    })
    .when('/faq', {
        templateUrl: "/views/faq.html",
        controller: "FaqCtrl"
    })
    .when('/profile', {
        templateUrl: "/views/profile.html",
        controller: "ProfileCtrl"
    })
    .otherwise({
        redirectTo: '/'
    });
};

routeConfig.$inject = ["$routeProvider"];
app.config(routeConfig);

app.filter('startFrom', function () {
    var filter = function (data, start) {
        return data.slice(start);
    };
    return filter;
});

app.constant('HTTP_ERRORS', {
    'UNAUTHORIZED': 401,
    'test': 503 
});
