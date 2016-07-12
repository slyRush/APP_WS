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

    $scope.deleteTask = function(idx){
        var task_to_delete = $scope.Arraytask[idx];

        taskFactory.deleteTask(task_to_delete.id).then(
            function(d){
                $scope.Arraytask.splice(idx, 1);
                $scope.alerts.push({ msg: 'supprimer avec succes', type: 'success' });
            },function(erroor){
                $scope.alerts.push({ msg: 'Une erreur est survenue', type: 'danger' });
            }
        )
    }


})
