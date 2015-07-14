signupModule.controller('SignupCtrl', function($scope, $log, $location, $ionicLoading, $cordovaToast, config, database, SignupFactory) {
	var moduleName = 'SignupCtrl';

	$scope.user = {};

	$scope.signup = function(isValid) {			
		var functionName = 'signup';

		$scope.submitted = true;

		if (isValid) {
			$ionicLoading.show({template: 'Signing up...'});

			var user = {
				userName: $scope.user.userName,
				password: $.sha1($.md5($scope.user.password)),
				name: $scope.user.name,
				email: $scope.user.email,
				language: $scope.user.language
			};
						
			SignupFactory.signup(user)
				.success(function(data) {
					$ionicLoading.hide();

					if (data.status == config.serviceStatuses.success && data.data.records != null) {
						config.user = {
							name: user.userName,
							password: user.password
						};

						$location.path('app/rubrics');											
					} else {						
						$cordovaToast.showLongBottom(data.message);
					}	                
	            })
	            .error(function(error) {
	            	$ionicLoading.hide();	            	
	                $cordovaToast.showLongBottom('The web service is offline.');
	            });                       			
		}
    };    
});