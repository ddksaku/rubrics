signupModule.factory('SignupFactory', function($http, config) {
    var signup = function(user) {
        return $http.post(config.baseUrl + config.servicePaths.signup, {
            username: user.userName, 
            password: user.password,
            name: user.name,
            email: user.email,
            language: user.language
        });        	
    };

    return {
        signup: signup
    };
})