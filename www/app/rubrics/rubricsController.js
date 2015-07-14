rubricsModule.controller('RubricsCtrl', function($scope, $location, config, RubricsFactory) {	
	RubricsFactory.getAll().then(
		function(data) {			
			$scope.rubrics = data;			
		});		

	$scope.go = function(rubricId) {
		config.rubricId = rubricId;		
	  	return $location.path('/app/classes/' + rubricId);
	};
});