studentsModule.controller('StudentsCtrl', function($scope, $stateParams, $location, config, StudentsFactory) {	
	StudentsFactory.gets($stateParams.classId).then(
		function(data) {
			$scope.students = data;
		});

	$scope.go = function(studentId) {
		config.studentId = studentId;				
		return $location.path('/app/rubricLines');
	};
});