app.config(function($stateProvider, $httpProvider, $urlRouterProvider, $provide) {
    $provide.decorator('$log', ['$delegate', function ($delegate) {
        var origLog = $delegate.log;
        var origInfo = $delegate.info;
        var origError = $delegate.error;
        var origWarn = $delegate.warn;
        var origDebug = $delegate.debug;
                
        $delegate.log = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origLog.apply(null, log)
        };

        $delegate.info = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origInfo.apply(null, log)
        };

        $delegate.error = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origError.apply(null, log)
        };

        $delegate.warn = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origWarn.apply(null, log)
        };

        $delegate.debug = function () {
            var args = [].slice.call(arguments);
            var log = [args.join(' - ')];
            
            // Send on our enhanced message to the original debug method.
            origDebug.apply(null, log)
        };

        return $delegate;
    }]);

    // We need to setup some parameters for http requests
    // These three lines are all you need for CORS support
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = false;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    // to fix an issue that $http.post does not pass parameters to $_REQUEST
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.interceptors.push(['$q', function($q) {
        return {
            request: function(config) {
                if (config.data && typeof config.data === 'object') {
                    config.data = $.param(config.data);
                }
                return config || $q.when(config);
            }
        };
    }]);            

    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/menus/appMenu.html',
        controller: 'AppCtrl'
    })

    .state('rubrics', {
        url: '/rubrics',
        abstract: true,
        templateUrl: 'app/menus/rubricsMenu.html'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'    
    })

    .state('signup', {
        url: '/signup',
        templateUrl: 'app/signup/signup.html',
        controller: 'SignupCtrl'
    })

    .state('forgotPassword', {
        url: '/forgotPassword',
        templateUrl: 'app/forgotPassword/forgotPassword.html'
    })

    .state('app.rubrics', {
        url: '/rubrics',
        views: {
            'menuContent': {
                templateUrl: 'app/rubrics/rubrics.html',
                controller: 'RubricsCtrl'
            }
        }
    })

    .state('app.classes', {
        url: '/classes/:rubricId',
        views: {
            'menuContent': {
                templateUrl: 'app/classes/classes.html',
                controller: 'ClassesCtrl'
            }
        }
    })

    .state('app.students', {
        url: '/students/:classId',
        views: {
            'menuContent': {
                templateUrl: 'app/students/students.html',
                controller: 'StudentsCtrl'
            }
        }
    })    

    .state('app.rubricLines', {
        url: '/rubricLines',
        views: {
            'menuContent': {
                templateUrl: 'app/rubricLines/rubricLines.html',
                controller: 'RubricLinesCtrl'
            }
        }
    })

    .state('app.rubricScore', {
        url: '/rubricScore/:type/:id',
        views: {
            'menuContent': {
                templateUrl: 'app/rubricScore/rubricScore.html',
                controller: 'RubricScoreCtrl'
            }
        }
    })
    
    .state('app.synchronize', {
        url: '/synchronize',
        views: {
            'menuContent': {
                templateUrl: 'app/synchronize/synchronize.html',
                controller: 'SynchronizeCtrl'
            }
        }
    })

    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'app/settings/settings.html'
            }
        }
    })

    .state('app.about', {
        url: '/about',
        views: {
            'menuContent': {
                templateUrl: 'app/about/about.html'
            }
        }
    });
  
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});