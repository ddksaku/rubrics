synchronizeModule.controller('SynchronizeCtrl', function($scope, $ionicLoading, $cordovaToast, SynchronizeFactory) {
	var moduleName = 'SynchronizeCtrl';

	$scope.downloadTables = function() {								
		$ionicLoading.show({template: 'Downlading tables...'});
		SynchronizeFactory.getTables().then(
			function(message) {
				$ionicLoading.hide();
				$cordovaToast.showLongBottom(message);
			},
			function(error) {
				$ionicLoading.hide();
				$cordovaToast.showLongBottom(error);
			});
	};	

	$scope.uploadTables = function() {								
		$ionicLoading.show({template: 'Uploading tables...'});
		SynchronizeFactory.putTables().then(
			function(message) {
				$ionicLoading.hide();
				$cordovaToast.showLongBottom(message);
			},
			function(error) {
				$ionicLoading.hide();
				$cordovaToast.showLongBottom(error);
			});
	};	
});