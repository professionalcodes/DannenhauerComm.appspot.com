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

app.factory('googleService', [function () {
    return {
        
    };
}])

app.factory('stripeService', [function () {
    
    function StripeController() {
        this.setStripeKeyTest();
        //this.setStripeKeyLive()
    }

    StripeController.prototype.setStripeKeyTest = function() {
        Stripe.setPublishableKey('pk_test_PUtiEiTgkjiLy19nfN4aQFzv');
    };

    StripeController.prototype.setStripeKeyLive = function() {
        Stripe.setPublishableKey("pk_live_YBQzKUjQx6HNKFoqouNPTlh4");
    };

    StripeController.prototype.exportToken = function(token) {
        jQuery.ajax({
            url: "/import_token",
            type: "POST",
            data: {"token": token},
            dataType: "JSON",
            success: function(data) {
                log(data);
            } 
        });
    }

    StripeController.prototype.createToken = function() {
        var self = this;

        Stripe.card.createToken({
            number: jQuery(".card-number").val(),
            cvc: jQuery(".card-cvc").val(),
            exp_month: jQuery(".card-expiry-month").val(),
            exp_year: jQuery(".card-expiry-year").val(),
            address_zip: jQuery(".address-zip").val()
        }, self.stripeResponseHandler);
    }

    StripeController.prototype.stripeResponseHandler = function(status, response) {
        var self = this;
        var form = jQuery("#payment-form");
        
        if (response.error) {
            form.find(".payment-errors").text(response.error.message);
            form.find("button").prop("disabled", false);

        } else {
            var token = response.id;
            StripeController.prototype.exportToken(token);
        }
    };
    return {
        stripeService: StripeController
    };
}])
app.factory('gapiLoaderService', [function () {
    var endpoints = {
        // 'main_endpoint' : {version: "v1"}
    };

    function GapiController(endpoints) {
        this.endpoints          = endpoints;
        this.endpointsKeys      = Object.keys(endpoints);
        this.endpointsLength    = this.endpointsKeys.length;
        this.gapiClient         = gapi.client;
        this.rootPath           = '//' + window.location.host + '/_ah/api';

        this.loadEndpointsAsync();
        //this.loadEndpointsSync(0);
    }

    GapiController.prototype.setApiKey = function(key) {
        this.gapiClient.setApiKey(key);
    };

    GapiController.prototype.loadEndpointsAsync = function() {

        var currentVersion;
        var counter = 0;
        var endpointKey;
        var self = this;

        for (endpointKey in this.endpoints) {
            currentVersion = this.endpoints[endpointKey].version;

            (function(endpoint, currentVersion) {
                self.gapiClient.load(endpoint, currentVersion, function() {
                    log(endpoint + " has been loaded");
                    counter++;
                    if (counter === self.endpointsLength) {
                        log("Done loading endpoints asynchronously, bootstrapping angular to the document");
                        angular.bootstrap(document, ["dannenhauerComm"]);
                    }
                }, self.rootPath);
            })(endpointKey, currentVersion)
        }
    }

    GapiController.prototype.loadEndpointsSync = function(counter) {

        if (counter === this.endpointsLength) {
            log("Done loading endpoints synchronously... stopping recursion, bootstrapping angular to the document");
            angular.bootstrap(document, ["nachosFlying"]);
            return;
        }

        var currentEndpoint = this.endpointsKeys[counter];
        var currentVersion  = this.endpoints[currentEndpoint].version;
        var self = this;

        this.gapiClient.load(currentEndpoint, currentVersion, function() {
            log(currentEndpoint + " is loaded");
            counter++;
            return self.loadEndpointsSync(counter);
        }, this.rootPath);
    }

    GapiController.prototype.executeRequest = function(request) {
        request.execute(function(response) {
            log(response);
        })
    };

    return {
        gapiLoader: GapiController
    };

}])

app.factory('serviceWorkerService', [function () {

    /* Controller wrapper class for service worker functionality */
    function ServiceWorker(sw_filepath, scope) {
        this.registerServiceWorker(sw_filepath, scope);
    };

    ServiceWorker.prototype.registerServiceWorker = function(sw_filepath, scope) {
        if ( ! ('serviceWorker' in navigator)) return;

        navigator.serviceWorker.register(sw_filepath, scope).then(function(registration) {
            log("Service Worker Registered");
            log(registration);
            registration.update();
            
        }).catch(function(err) {
            log('Registration failed!');
            log(err);
        });
    };

    ServiceWorker.prototype.setServiceWorkerGlobal = function(serviceWorkerObj) {
        this.serviceWorkerGlobalObj = serviceWorkerObj;
        console.log(this.serviceWorkerGlobalObj);
    };

    return {
        serviceWorker: ServiceWorker,
        enpoints: endpoints
    };

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


