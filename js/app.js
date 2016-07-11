angular
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
.controller('MainCtrl', function ($scope, $window, conf) {
    $scope.disconnect = function () {
        sessionStorage.removeItem("UserConnected");
        $window.location.href = conf.site+'login.html';
    }
})
.config(function ($routeProvider, $httpProvider) {
   var viewsFolder = "../views/";

    $routeProvider
    //.when('/', { templateUrl: 'Home', controller: 'home' })
    .when('/annuel', { templateUrl: 'Annuel', controller: 'annuel' })
    //.when('/mensuel', { templateUrl: 'Mensuel', controller: 'mensuel' })
    //.when('/priseEnCharge', { templateUrl: 'PriseEnCharge', controller: 'priseEnCharge' })
    //.when('/traitement', { templateUrl: 'Traitement', controller: 'traitement' })

    .otherwise({ redirectTo: '/annuel' });

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

    /*$rootScope.userConnected = JSON.parse(strUserConnected);*/
    /*$rootScope.header = {
        headers: {
            'Content-Type': 'application/json',
            //'Access-Control-Allow-Origin' : '*',
            //'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE'
            'token': $rootScope.userConnected.token,
            'password': $rootScope.userConnected.user.password,
            'login': $rootScope.userConnected.user.login
        }
    }*/
})
;