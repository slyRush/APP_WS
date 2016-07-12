/**
 * Created by Dev on 12/07/2016.
 */
app.controller('taskController',function ($scope,taskFactory) {
    $scope.tasks = taskFactory.getTasks().then(function (d) {
        $scope.tasks = d.data.records.tasks;
        $scope.result = d.data.result.message;
        $scope.Arraytask = [];
        angular.forEach($scope.tasks, function(value, key) {
            $scope.Arraytask.push(value);
        });
    }, function (error) {
        $scope.alerts.push({ msg: 'Une erreur est survenue', type: 'danger' });
    });

})