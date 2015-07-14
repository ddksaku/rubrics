classesModule.controller('ClassesCtrl', function($scope, $stateParams, ClassesFactory) {	
	ClassesFactory.gets($stateParams.rubricId).then(
		function(data) {
			$scope.classes = data;
		});
});