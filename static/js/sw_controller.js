/* Controller wrapper class for service worker functionality */
function ServiceWorker(sw_filepath, scope) {
	this.registerServiceWorker(sw_filepath, scope);
}

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
}

ServiceWorker.prototype.setServiceWorkerGlobal = function(serviceWorkerObj) {
	this.serviceWorkerGlobalObj = serviceWorkerObj;
	console.log(this.serviceWorkerGlobalObj);
}

var serviceWorkerController = new ServiceWorker("/sw.js", {scope: "/"});


/* chrome://inspect/#service-workers */

/* 
enum ServiceWorkerState {
  "installing",
  "installed",
  "activating",
  "activated",
  "redundant"
}; 

*/