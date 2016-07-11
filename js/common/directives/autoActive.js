angular.module('common.directives')
.directive('autoActive', ['$location', '$timeout', function ($location, $timeout) {
  return {
    restrict: 'A',
    scope: false,
    link: function (scope, element) {
      function setActive() {
        var path = $location.path();
        if (path) {
          angular.forEach(angular.element(document.getElementsByClassName("auto-active")).find('a'), function (a) {
            var currentParent = angular.element(a).parent('li');
            if (a.href.split('#')[1] == path) {
              resetActive();
              if(currentParent.hasClass('section')) {
                currentParent.addClass('active');
              }
              if(currentParent.hasClass('page')) {
                currentParent.addClass('active');
                currentParent.parent('ul').addClass('in height');
                currentParent.parent('ul').parent('li').addClass('active');
              }
            }
          });
        }
      }
      function resetActive() {
        angular.forEach(angular.element(document.getElementsByClassName("active")), function (elem) {
          angular.element(elem).removeClass('active');
        });
        angular.forEach(angular.element(document.getElementsByClassName("height")), function (elem) {
          angular.element(elem).removeClass('height');
        });
        angular.forEach(angular.element(document.getElementsByClassName("in")), function (elem) {
          angular.element(elem).removeClass('in');
        });
      }
      
      $timeout(function() {
        setActive();
      }, 600);

      scope.$on('$locationChangeSuccess', setActive);
    }
  }
}]);