loginModule.controller('LoginCtrl', function($scope, $log, $location, $ionicLoading, $cordovaToast, config, database, LoginFactory) {
	var moduleName = 'LoginCtrl';

	$scope.user = {
		name: '',
		password: ''
	};

	$scope.login = function(isValid) {			
		var functionName = 'login';

		$scope.submitted = true;

		if (isValid) {
			$ionicLoading.show({template: 'Logging in...'});

			var userName = $scope.user.name;
			var password = $.sha1($.md5($scope.user.password));

			database.hasTable(config.tableNames.user).then(
				function(data) {
                    if (data) { // user table exists
                        $log.info(moduleName, functionName, 'Trying to log in via local.');                     
                        loginViaLocal(userName, password);                    
                    } else { // user table does not exist
                        $log.info(moduleName, functionName, 'Trying to log in via web.');                     
                        loginViaWeb(userName, password);
                    }
                },
                function() { // user table does not exist
                    $log.info(moduleName, functionName, 'Trying to log in via web.');   
                    loginViaWeb(userName, password);
                });                       			
		}
    };

    var loginViaWeb = function(userName, password) {    	
    	LoginFactory.login(userName, password)
				.success(function(data) {					
					$ionicLoading.hide();

					if (data.status == config.serviceStatuses.success && data.data.records != null) {
						config.user = {
							name: userName,
							password: password
						};

						$location.path('app/rubrics');
						// $location.path('app/rubricScore/r/1');						
					} else {
						$cordovaToast.showLongBottom('Invalid user name or password.');
					}	                
	            })
	            .error(function(error) {	            	
	            	$ionicLoading.hide();	            	
	                $cordovaToast.showLongBottom('The web service is offline.');
	            });               
    };
    
    var loginViaLocal = function(userName, password) {
        var functionName = 'loginViaLocal';
        
        var query = 'SELECT * FROM ' + config.tableNames.user + ' WHERE username = ? AND password = ?';
        database.executeSql(query, [userName, password]).then(
        	function(data) {
        		$ionicLoading.hide();

        		if (data.length > 0) {
        			config.user = {
						name: userName,
						password: password
					};

					$location.path('app/rubrics');
					// $location.path('app/rubricScore/r/1');
        		} else {        			
        			$cordovaToast.showLongBottom('Invalid user name or password.');
        		}
        	},
        	function(error) {
        		$ionicLoading.hide();
        		$cordovaToast.showLongBottom('Invalid user name or password.');
        	});        
    };
});