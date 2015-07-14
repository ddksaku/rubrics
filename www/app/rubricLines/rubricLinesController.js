rubricLinesModule.controller('RubricLinesCtrl', function($scope, $location, config, RubricLinesFactory) {
	RubricLinesFactory.gets(config.rubricId, config.studentId).then(	
	// RubricLinesFactory.gets(1, 1).then(
		function(data) {
			var rubricLines = [];
			var rubricLine = {};		
			_.each(data, function(score) {				
				if (_.isUndefined(rubricLine.id) || rubricLine.id != score.rubric_line_id) {
					rubricLine = {id: score.rubric_line_id, r: {}, t1: {}, t2: {}, i: {}};
					rubricLines.push(rubricLine);					
				}
				var rubricScore = {};
				rubricLine[score.type.toLowerCase()] = {
					id: score.id,
					description: score.description,
					review: score.review,
					feedback: score.feedback
				};				
			});
			$scope.rubricLines = rubricLines;
		});	
	
	$scope.go = function(rubricLineId, path) {
		config.rubricLineId = rubricLineId;
	  	return $location.path(path);
	};
});