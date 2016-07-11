var MyApp = angular.module('MyApp', ['GlobalConfig', 'common.services', 'ngProgress','ui.bootstrap']);
MyApp.controller('LoginController', function (
    $scope,
    $rootScope,
    conf,
    $window,
    crud,
    ngProgressFactory
    )
{
    $scope.Submitted = false;
    $scope.IsFormValid = false;
    $scope.alerts = [];
    $scope.progressbar = ngProgressFactory.createInstance();

    if (conf.entryPoint.trim() == "") {
        alert('err');
    }

    var userConnected = sessionStorage.getItem("UserConnected");
    if (userConnected != null) {
        $window.location.href = conf.site+'index.html';
    }

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.$watch('loginForm.$valid', function (newval) {
        $scope.IsFormValid = newval;
    });

    $scope.connexion = function () {
        $scope.progressbar.start();
        $scope.Submitted = true;
        if ($scope.IsFormValid) {
            var userAuth = {
                email : $scope.login ,
                password : $scope.password
            };
            crud.connexion(userAuth).then(function (d) {
                if (d.data.result.state) {
                    var result = d.data;
                    var StrUserConnected = JSON.stringify(result);
                    sessionStorage.setItem("UserConnected", StrUserConnected);
                    $scope.progressbar.complete();
                    $window.location.href = conf.site + 'index.html';
                }
                else {
                    $scope.alerts.push({ msg: 'Merci de vérifier votre login et mot de passe', type: 'warning' });
                    $scope.progressbar.complete();
                }
            }, function (error) { 
                $scope.alerts.push({ msg: 'Une erreur est survenue', type: 'danger' });
                $scope.progressbar.complete();
            });
        } 
    };
    
});