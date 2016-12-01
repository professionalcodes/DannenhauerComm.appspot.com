/* Define a list of endpoints on our google backend that we will load in using google client js lib. Each endpoint has its associated angular controller that calls it. */
var endpoints = {
	// 'main_endpoint' : {version: "v1"}
};

function GapiController(endpoints) {
	this.endpoints 			= endpoints;
	this.endpointsKeys		= Object.keys(endpoints);
	this.endpointsLength 	= this.endpointsKeys.length;
	this.gapiClient 		= gapi.client;
	this.rootPath 			= '//' + window.location.host + '/_ah/api';

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
	var currentVersion 	= this.endpoints[currentEndpoint].version;
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

/* Called Once the Google JS Client lib has loaded*/
function init() {
	window.gapiController = new GapiController(endpoints);
}
