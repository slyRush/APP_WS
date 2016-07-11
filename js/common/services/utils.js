angular.module('common.services')
.factory('utils', function ($http) {
  var fac = {};

  fac.getCurrentYear = function () {
    return new Date().getFullYear();
  };

  fac.getCurrentMonth = function () {
    return new Date().getMonth();
  };

  fac.getLastDayOfMonth = function (year, month) {
    return new Date(year, month+1, 0).getDate();
  }

  return fac;
})
;