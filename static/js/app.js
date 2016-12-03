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
        templateUrl: "/views/firebaseui.html",
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

app.factory("firebaseService", function() {
    var config = {
        apiKey: "AIzaSyBuZF9WPAKxCbogJysd_3BUwdvgCL2NAO4",
        authDomain: "dannenhauercommunications.firebaseapp.com",
        databaseURL: "https://dannenhauercommunications.firebaseio.com",
        storageBucket: "dannenhauercommunications.appspot.com",
        messagingSenderId: "504950093826",
        'signInSuccessUrl': '/#/profile',
        'signInOptions': [
            {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                scopes: [
                    'https://www.googleapis.com/auth/plus.login'
                ]
            },
            {
                provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                scopes: [
                    'public_profile',
                    'email',
                    'user_likes',
                    'user_friends'
                ]
            },
            {
                provider: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            },
            {    
                provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
            },
        ]
    };

    var firebaseServiceHelper = {

        loadFirebaseLoginUi: function(eid) {
            firebase.initializeApp(config);
            var ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#' + eid, config);
        },

    }

    return firebaseServiceHelper;
})

