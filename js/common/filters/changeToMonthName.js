angular.module('common.directives')
.filter('changeToMonthName', function($filter) {
  var month =  ["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
   "août", "septembre", "octobre", "novembre", "décembre" ];
   
  return function(input) {
    return month[input];
  };
})