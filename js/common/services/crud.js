angular.module('common.services')
.factory('crud', function ($http,conf,$rootScope) {
  var fac = {};
  fac.connexion = function (userAuth) {
    return $http.post(url = conf.entryPoint.trim() + 'login', userAuth, { headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin' : 'http://10.2.150.239/fap_training/v1/'} });
    //return $http.get(conf.entryPoint.trim() + 'OtherSolution/api.php/tasks?transform=1');
  };
  fac.get = function (ws, search, changeYear) {
    var site = search.site.split(' - ')[0],
    plaque = search.plaque.split(' - ')[0];
    return $http.get(conf.entryPoint.trim() + ws +'/?year=' + search.annee + '&month=' + search.month + '&marque=' + search.marque + '&code_plaque=' + plaque + '&code_site=' + site + '&metier=' + search.metier + '&changeYear=' + changeYear, $rootScope.header);
  };
  fac.selectPlaque = function (plaque) {
    var plaque = plaque.split(' - ')[0];
    return $http.get(conf.entryPoint.trim() + 'Plaque/?plaque='+plaque, $rootScope.header);
  };
  fac.selectMarque = function (marque) {
    return $http.get(conf.entryPoint.trim() + 'Marque/?marque='+marque, $rootScope.header);
  };
  return fac;
});