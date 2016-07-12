var app = angular
.module('myApp',
  [
      'ngRoute',
      'ui.bootstrap',
      'googlechart',
      'ui.select',
      'ngProgress',
      'common.modules',
      'common.services',
      'common.directives',
      'common.filters',
      'GlobalConfig'
  ]
)

.controller('MainCtrl', function ($scope, $window, conf, crud) {
    $scope.disconnect = function () {
        sessionStorage.removeItem("UserConnected");
        $window.location.href = conf.site+'login.html';
    };


    $scope.getAllTasks = function () {
        //$scope.progressbar.start();
        //$scope.Submitted = true;

        crud.getTasks().then(function (d) {
            console.log(d.data.records);
            if (d.data.records.tasks != NULL) {
                var result = d.data;
                console.log(result);
            }
            else {
                $scope.alerts.push({ msg: 'Tasks non chargés', type: 'warning' });
                //$scope.progressbar.complete();
            }
        }, function (error) {
            $scope.alerts.push({ msg: 'Une erreur est survenue', type: 'danger' });
            //$scope.progressbar.complete();
        });

    };

})
.config(function ($routeProvider, $httpProvider) {
   var viewsFolder = "../views/";

    $routeProvider
    //.when('/', { templateUrl: 'Home', controller: 'home' })
    .when('/annuel', { templateUrl: 'Annuel', controller: 'annuel' })
    //.when('/mensuel', { templateUrl: 'Mensuel', controller: 'mensuel' })
    //.when('/priseEnCharge', { templateUrl: 'PriseEnCharge', controller: 'priseEnCharge' })
    //.when('/traitement', { templateUrl: 'Traitement', controller: 'traitement' })
    .when('/tasks', {templateUrl:'task.view.html', cotroller : 'taskController'})

    .otherwise({ redirectTo: '/login.html' });

    //Enable cross domain calls
    //$httpProvider.defaults.useXDomain = true;
    //$http.useXDomain = true;
})
.run(function ($rootScope, menu, $window) {
    $rootScope.$on("$routeChangeSuccess", function (event, data) {
        $rootScope.controller = data.controller;
    });

    $rootScope.isMenuOpen = true;
    $rootScope.menu = menu;
    $rootScope.blabla = "rico";

    $rootScope.alerts = [];
    $rootScope.$on('newAlert', function(event, args){
        $rootScope.alerts.push(args);
    });

    $rootScope.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
    };

    $rootScope.setCollapse = function (data, item) {
        var itemClosed = item.closed;
        angular.forEach(data, function (d) {
            d.closed = true;
        });
        item.closed = !itemClosed;
    };

    $rootScope.toggleSideBar = function () {
        var pageContent = angular.element(document.getElementsByClassName("page-content"));      
        
        if(pageContent.hasClass('toggled')) {
            pageContent.removeClass('toggled');
            $rootScope.isMenuOpen = true;
        } else {
            pageContent.addClass('toggled');
            $rootScope.isMenuOpen = false;
        }
    };

    var strUserConnected = sessionStorage.getItem("UserConnected");
    if (strUserConnected == null) {
        //$window.location.href = conf.site;
    }

    $rootScope.userConnected = JSON.parse(strUserConnected);
    $rootScope.header = {
        headers: {
            'Authorization': $rootScope.userConnected.records.apiKey
            //'password': $rootScope.userConnected.user.password,
            //'login': $rootScope.userConnected.user.login
        }
    }


})
;