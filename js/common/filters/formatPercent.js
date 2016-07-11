angular.module('common.directives')
.filter('filterPercent', function($filter) {
  return function(input) {
    if(Number(input) === input && input % 1 !== 0) {
      input = $filter('number')(input, 2);
    }
    return input;
  };
})