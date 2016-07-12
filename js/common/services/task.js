/**
 * Created by Dev on 12/07/2016.
 */
angular.module('common.services')
    .factory('taskFactory', function ($http,conf,$rootScope,$q) {
        var factory = {}
        factory.getTasks = function() {
            return $http.get(conf.entryPoint.trim() + 'tasks', $rootScope.header)
        };
        factory.getTask = function(id) {
            var deferred = $q.defer();
            var task = {};
            tasks = factory.getTaskss().then(function(tasks){
                angular.forEach(tasks, function(value, key) {
                    console.log(value);
                });
                deferred.resolve(task);
            },function(msg){
                deferred.reject(msg);
            })
            return deferred.promise;
        };
        factory.deleteTask=function(idToDelete){
            return $http.delete(conf.entryPoint.trim()+'tasks/'+idToDelete, $rootScope.header);
        }

        return factory;
    });
