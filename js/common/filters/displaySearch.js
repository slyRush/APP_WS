angular.module('common.directives')
.filter('displaySearch', function($filter) {
  return function(search) {
    var input = '';
    var i = 0
    angular.forEach(Object.keys(search), function(key) {
      var s = search[key];
      if(s && s != '') {
        if(key == 'month') {
          s = $filter('changeToMonthName')(s);
        }
        var value = ' - ' + s;
        if(i == 0) {
          value = s;
        }
        input = input + value;
        i++;
      }
      
    });
    return input;
  };
})