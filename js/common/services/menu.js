angular.module('common.services')
.factory('menu', function () {
  return [
    {
      name: 'accueil',
      url: '#/',
      ico: 'fa fa-home'
    },
    {
      name: 'USER',
      ico: 'fa fa-user',
      closed: true,
      children : [
        {
          name: 'liste des utlisateurs',
          url: '#/annuel'

        }

      ]
    },
    {
      name: 'TASK',
      ico: 'fa fa-tasks',
      closed: true,
      children : [
        {
          name: 'Lists',
          url: '#/tasks'

        }

      ]
    }
  ];
});