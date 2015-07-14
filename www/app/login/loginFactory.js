loginModule.factory('LoginFactory', function($http, config) {
    var login = function(userName, password) {       	       
        return $http.post(config.baseUrl + config.servicePaths.login, {
            username: userName, 
            password: password
        });        	
    };

    return {
        login: login
    };
})