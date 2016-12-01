var dannenhauerComm = dannenhauerComm || {};
var controllers = dannenhauerComm.controllers = angular.module('dannenhauerCommControllers', ['ngRoute']);

controllers.controller('RootCtrl', ['$scope', '$location', function ($scope, $location) {
    
}])

controllers.controller('SignupCtrl', ['$scope', '$location', function ($scope, $location) {
        
    $scope.validUsername = false;
    $scope.validPassword = false;
    $scope.validConfirmedPassword = false;
    $scope.validEmail = false;
    $scope.ajaxController = window.ajaxController;

    $scope.allFieldsValid = function() {
        return ($scope.validUsername && $scope.validPassword && $scope.validConfirmedPassword && $scope.validEmail);
    };

    $scope.setUsernameError = function() {
        jQuery("#username-status").text("Username is invalid: Username must be at least 5 characters").css("color", "red")
    };

    $scope.setUsernameValid = function() {
        jQuery("#username-status").text("Username is valid!").css("color", "green")
    };

    $scope.setUsernameExists = function() {
        jQuery("#username-status").text("Username already exists").css("color", "red")
    };

    $scope.setPasswordError = function() {
        jQuery("#password-status").text("Password is Invalid: Password Must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number").css("color", "red");
    };

    $scope.setPasswordValid = function() {
        jQuery("#password-status").text("Password is valid!").css("color", "green");
    };

    $scope.setConfirmPasswordNoMatchError = function() {
        jQuery("#confirm-password-status").text("Passwords do not Match").css("color", "red");
    };

    $scope.setConfirmPasswordsMatch = function() {
        jQuery("#confirm-password-status").text("Passwords Match!").css("color", "green");
    };

    $scope.setEmailError = function() {
        jQuery("#email-status").text("Invalid Email").css("color", "red");
    };

    $scope.setEmailExists = function() {
        jQuery("#email-status").text("Email already exists").css("color", "red");
    };

    $scope.setEmailValid = function() {
        jQuery("#email-status").text("Email is Valid!").css("color", "green");
    };

    $scope.handleUsername = function() {

        if (!validUsername($scope.username)) {
            $scope.setUsernameError();
            $scope.validUsername = false;
        }

        else if (validUsername($scope.username)) {
            $scope.checkUsernameExists();   
        }
    };

    $scope.handlePassword = function() {
        if (!validPassword($scope.password)) {
            $scope.setPasswordError();
            $scope.validPassword = false;
        }

        else if (validPassword($scope.password)) {
            $scope.setPasswordValid();
            $scope.validPassword = true;
        }
    };

    $scope.handleConfirmedPassword = function() {
        if (passwordsMatch($scope.password, $scope.confirmedPassword)) {
            $scope.setConfirmPasswordsMatch();
            $scope.validConfirmedPassword = true;
        }

        else {
            $scope.setConfirmPasswordNoMatchError();
            $scope.validConfirmedPassword = false; 
        }
    };

    $scope.handleEmail = function() {
        if (validEmail($scope.email)) {
            $scope.checkEmailExists();
        }

        else {
            $scope.setEmailError();
            $scope.validEmail = false;
        }
    };

    $scope.dataExists = function(data) {
        return data.hasOwnProperty("exists") && data.exists
    };

    $scope.checkEmailExists = function() {
        $scope.ajaxController.checkSignupData("email", {email: $scope.email}, function(data) {
            if ($scope.dataExists(data)) {
                $scope.setEmailExists();
                $scope.validEmail = false;
            } else  {
                $scope.setEmailValid();
                $scope.validEmail = true;
            }
        });     
    };

    $scope.checkUsernameExists = function() {
        $scope.ajaxController.checkSignupData("username", {username: $scope.username}, function(data) {
            if ($scope.dataExists(data)) {
                $scope.setUsernameExists();
                $scope.validUsername = false;
            } else  {
                $scope.setUsernameValid();
                $scope.validEmail = true;
            }
        });  
    };

    $scope.signupUser = function() {
        if ($scope.allFieldsValid()) {
            jQuery.ajax({
                url: "/signup",
                type: "post",
                data: {username: $scope.username, password: $scope.password, email: $scope.email},
                dataType: "json",
                success: function(data) {
                    log(data);
                    if (data.hasOwnProperty("created") && data.created) {
                        jQuery("#signup-success").removeClass("hidden");
                        window.setTimeout(function() {window.location = "/#/login"}, 1000)
                    } else {
                        jQuery("#signup-error").removeClass("hidden");
                    }
                },
                fail: function(data) {
                    jQuery("#signup-error").removeClass("hidden");
                },
                error: function(data) {
                    jQuery("#signup-error").removeClass("hidden");
                }
            });
        } else {
            jQuery("#signup-form-error").removeClass("hidden");
        }
    };

    $scope.removeOtherAlerts = function(eid) {
        var alerts = jQuery(".alert");
        jQuery.each(alerts, function(i, v) {
            if (v.id !== eid && v.className.indexOf("hidden") === -1) v.className += " hidden";
        });
    };

    $scope.onUsernameFocus = function() {
        $scope.handleUsername();
    };

    $scope.onUsernameUnfocus = function() {
        $scope.handleUsername();
    };

    $scope.usernameOnChange = function() {
        $scope.handleUsername();
    };

    $scope.onPasswordFocus = function() {
        $scope.handlePassword();
    };

    $scope.onPasswordUnfocus = function() {
        $scope.handlePassword();
    };

    $scope.onPasswordChange = function() {
        $scope.handlePassword();
    };

    $scope.onConfirmedPasswordFocus = function() {
        $scope.handleConfirmedPassword();
    };

    $scope.onConfirmedPasswordChange = function() {
        $scope.handleConfirmedPassword();
    };

    $scope.onConfirmedPasswordUnfocus = function() {
        $scope.handleConfirmedPassword();
    };

    $scope.onEmailFocus = function() {
        $scope.handleEmail();
    };

    $scope.onEmailChange = function() {
        $scope.handleEmail()
    };

    $scope.onEmailUnfocus = function() {
        $scope.handleEmail();
    };

}])

controllers.controller('LoginCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.logIn = function() {
        jQuery.ajax({
            url: "/log_user_in",
            type: "post",
            data: {username: $scope.username, password: $scope.password},
            dataType: "json",
            success: function(obj) {
                if (obj.hasOwnProperty("access_granted") && obj.access_granted) {
                    jQuery("#login-success").removeClass("hidden");
                    $scope.removeOtherAlerts("login-success");
                    setTimeout(function() {window.location = "/#/profile"; window.location.reload()}, 1200);
                } else {
                    jQuery("#login-failed").removeClass("hidden");
                    $scope.removeOtherAlerts("login-failed");
                }
            },
            error: function() {
                jQuery("#something-happened").removeClass("hidden");
                $scope.removeOtherAlerts("something-happened");
            }, 
            fail: function() {
                jQuery("#something-happened").removeClass("hidden");
                $scope.removeOtherAlerts("something-happened");
            }
        });
    };

    $scope.removeOtherAlerts = function(eid) {
        var alerts = jQuery(".alert");
        jQuery.each(alerts, function(i, v) {
            if (v.id !== eid && v.className.indexOf("hidden") === -1) v.className += " hidden";
        });
    };

}])

controllers.controller('FaqCtrl', ['$scope', '$location', function ($scope, $location) {
    
}])

controllers.controller('AboutCtrl', ['$scope', '$location', function ($scope, $location) {

}])

controllers.controller('ContactCtrl', ['$scope', '$location', function ($scope, $location) {
    
}])

