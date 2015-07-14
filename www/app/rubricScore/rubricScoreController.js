rubricScoreModule.controller('RubricScoreCtrl', function($scope, $stateParams, $location, $cordovaToast, $cordovaCamera, $cordovaCapture, 
	RubricScoreFactory, config) {
	var id = $stateParams.id;
	var type = $stateParams.type.toUpperCase();;

	$scope.rubricScore = {
		type: type,
		description: '',
		review: '',
		feedback: ''
	};

	if (!_.isEmpty(id)) {
		RubricScoreFactory.get(id).then(
		function(data) {			
			$scope.rubricScore = data;
		});	
	}
	
	$scope.save = function() {
		if (_.isEmpty(id)) { // insert
			RubricScoreFactory.insert(config.rubricLineId, $scope.rubricScore).then(
				function(data) {					
					return $location.path('/app/rubricLines');
				},
				function(error) {
					$cordovaToast.showLongBottom('Failed to save a score.');
					return $location.path('/app/rubricLines');
				});
		} else { // update
			RubricScoreFactory.update($scope.rubricScore).then(
				function(data) {
					return $location.path('/app/rubricLines');
				},
				function(error) {
					$cordovaToast.showLongBottom('Failed to save a score.');
					return $location.path('/app/rubricLines');
				});
		}
	};
	
	$scope.captureImage = function() {
		// var options = {
		// 	destinationType: Camera.DestinationType.FILE_URI,
		// 	sourceType: Camera.PictureSourceType.CAMERA			
		// };

		// $cordovaCamera.getPicture(options).then(
		// 	function(imageUri) {		
		// 	}, 
		// 	function(err) {		
		// 	});

		var options = { limit: 3 };

	    $cordovaCapture.captureImage(options).then(
	    	function(imageData) {
	      		// Success! Image data is here
	    	}, 
	    	function(error) {
	      		// An error occurred. Show a message to the user
	    });
	};

	$scope.captureVideo = function() {
		var options = { limit: 3, duration: 15 };

	    $cordovaCapture.captureVideo(options).then(
	    	function(videoData) {
	      		// Success! Video data is here
	    	}, 
	    	function(error) {
	      		// An error occurred. Show a message to the user
	    	});		
	};

	$scope.captureAudio = function() {
		var options = { limit: 3, duration: 10 };

	    $cordovaCapture.captureAudio(options).then(
	    	function(audioData) {
	      		// Success! Audio data is here
	    	}, 
	    	function(error) {
	      		// An error occurred. Show a message to the user
	    	});
	};
});