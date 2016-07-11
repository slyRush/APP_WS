angular.module('common.directives')
.filter('formatMonth', function($filter) {
  return function(input) {
    var split = input.split('-');
    return split[0].charAt(0).toUpperCase() + split[0].slice(1) + ' ' + split[1];
  };
})