var loginModule = angular.module('login', []);
var signupModule = angular.module('signup', []);
var forgotPasswordModule = angular.module('forgotPassword', []);
var classesModule = angular.module('classes', []);
var studentsModule = angular.module('students', []);
var subjectsModule = angular.module('subjects', []);
var rubricsModule = angular.module('rubrics', []);
var rubricLinesModule = angular.module('rubricLines', []);
var rubricScoreModule = angular.module('rubricScore', []);
var settingsModule = angular.module('settings', []);
var aboutModule = angular.module('about', []);
var synchronizeModule = angular.module('synchronize', []);
var databaseModule = angular.module('database', []);

var app = angular.module('app', ['ionic', 'angular-underscore', 'ngStorage', 'ngCordova',
    'login',
    'signup',
    'forgotPassword',
    'classes',
    'students',
    'subjects',    
    'rubrics',
    'rubricLines',
    'rubricScore',
    'settings',
    'about',
    'synchronize',
    'database'])
    .controller('AppCtrl', function($scope, $location, $ionicHistory, config) {
        $scope.logOut = function() {
            $ionicHistory.clearCache();
            config.user = null;            
            $location.path('login');
        };
    });

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

