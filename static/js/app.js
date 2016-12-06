'use strict';

var app = angular.module('dannenhauerComm', ['dannenhauerCommControllers', 'ngRoute']);

var configuration = function($routeProvider) {
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

configuration.$inject = ["$routeProvider", '$interpolateProvider'];

app.config(configuration);

app.factory('stripeService', ['$http', function ($http) {

    var stripeController = {

        setStripeKeyTestVersion: function() {
            Stripe.setPublishableKey('pk_test_PUtiEiTgkjiLy19nfN4aQFzv');
        },

        setStripeKeyLive: function() {
            Stripe.setPublishableKey("pk_live_YBQzKUjQx6HNKFoqouNPTlh4");
        },

        exportToken: function(token) {
            $http({method: "POST", url: "/stripeapi", data: {"token": token} }).then(function(response) {
                log(response);
            });
        },

        createToken: function() {
            Stripe.card.createToken({
                number: jQuery(".card-number").val(),
                cvc: jQuery(".card-cvc").val(),
                exp_month: jQuery(".card-expiry-month").val(),
                exp_year: jQuery(".card-expiry-year").val(),
                address_zip: jQuery(".address-zip").val()
            }, this.stripeResponseHandler);
        },

        stripeResponseHandler: function() {
            var form = jQuery("#payment-form");
        
            if (response.error) {
                form.find(".payment-errors").text(response.error.message);
                form.find("button").prop("disabled", false);

            } else {
                var token = response.id;
                StripeController.prototype.exportToken(token);
         }
        }
    };

    return stripeController;

}]);

app.factory('gapiLoaderService', [function () {

    var gapiController = {
        endpoints: {},
        endpointKeys: Object.keys(endpoints),
        endpointsKeysLength: this.endpointsKeys.length,
        gapiClient: gapi.client,
        rootPath: '//' + window.location.host + '/_ah/api',
        setGapiApiKey: function(key) {
            this.gapiClient.setApiKey(key);
        },

        loadEndpointsAsync: function() {
            var currentVersion;
            var counter = 0;
            var endpointName;
            var self = this;

            for (endpointName in this.endpoints) {
                currentVersion = this.endpoints[endpointName].version;

                (function(nameofEndpoint, currentVersion) {
                    self.gapiClient.load(nameOfEndpoint, currentVersion, function() {
                        log(endpoint + " has been loaded");
                        counter++;
                    }, self.rootPath);
                })(endpointName, currentVersion)
            } 
        },

        loadEndpointSync: function() {

            if (counter === this.endpointsLength) window.gapiEndpointsLoaded = true;
        
            var currentEndpoint = this.endpointsKeys[counter];
            var currentVersion  = this.endpoints[currentEndpoint].version;

            this.gapiClient.load(currentEndpoint, currentVersion, function() {
                log(currentEndpoint + " is loaded");
                counter++;
                return this.loadEndpointsSync(counter);
            }, this.rootPath);
        },
    };

    return gapiController;

}]);

app.factory("seviceWorkerService", [function() {

    serviceWorkerController - {

        registerServiceWorker: function() {
            if ( ! ('serviceWorker' in navigator)) return;

            navigator.serviceWorker.register(sw_filepath, scope).then(function(registration) {
                log("Service Worker Registered");
                log(registration);
                registration.update();
            
            }).catch(function(err) {
                log('Registration failed!');
                log(err);
            });
        },
    }

    return serviceWorkerController;

}]);

/* chrome://inspect/#service-workers */

    /* 
    enum ServiceWorkerState {
      "installing",
      "installed",
      "activating",
      "activated",
      "redundant"
*/


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


