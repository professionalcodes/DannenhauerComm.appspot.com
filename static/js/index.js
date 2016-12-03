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

    jQuery(document).ready(function() {
        var indexController = new IndexController();
        indexController.setLogOnResize();
        angular.bootstrap(document, ["dannenhauerComm"]);
    });

})()




