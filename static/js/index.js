'use strict';
(function() {
    function IndexController() {}

    IndexController.prototype.setLogOnResize = function() {
        var currentCoords;
        jQuery(document).resize(function(event) {
            currentCoords = jQuery(document).width() + "," + jQuery(document).height();
            log(currentCoords);
        });
    };

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


    function AjaxController() {}

    AjaxController.prototype.urlMap = {
        "username": "/check_username_exists",
        "email": "/check_email_exists"
    }

    AjaxController.prototype.checkSignupData = function(inputType, dataObject, cb) {
        var self = this;
        jQuery.ajax({
            url: self.urlMap[inputType],
            type: "POST",
            data: dataObject,
            dataType: "JSON",
            success: function(data) {
                cb(data);
            } 
        });
    }

    jQuery(document).ready(function() {
        var indexController = new IndexController();
        indexController.setLogOnResize();
        window.ajaxController = new AjaxController();
    });

})()




