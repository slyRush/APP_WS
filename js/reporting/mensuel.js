angular.module('common.modules')
.controller('mensuel', function($scope, $rootScope, crud, utils, ngProgressFactory, Excel, $timeout, $filter) { 
  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.currentYear = utils.getCurrentYear();
  $scope.currentMonth = utils.getCurrentMonth()+1;
  $scope.firstLoad = true;
  $scope.prevAnnee = $scope.currentYear;
  $scope.prevMonth = $scope.currentMonth;
  $scope.prevMarque = '';
  $scope.prevPlaque = '';

  $scope.$watch('search', function() {
    $scope.getData();
  }, true);

  $scope.resetFilter = function (filter) {
    if(filter == 'annee') {
      $scope.search[filter] = $scope.currentYear;
    } else if (filter == 'month') {
      $scope.search[filter] = $scope.currentMonth;
    }else{
      $scope.search[filter] = '';
    }
  }

  $scope.initSeries = function () {
    $scope.series = {
        'status_general': { name: 'Status général', title: true, bold: false },
        'lead_recus': { name: 'Leads reçus', title: false, data: [], bold: false },
        'lead_traites': { name: 'Leads traités', title: false, data: [], bold: false },
        'lead_argumentes': { name: 'Leads argumentés', title: false, data: [], bold: false },
        'lead_encours': { name: 'Leads en cours', title: false, data: [], bold: false },
        'status_arguments': { name: 'Status argumentés', title: true, data: [], bold: false },
        'arg_positifs': { name: 'Leads argumentés positifs', title: false, data: [], bold: true },
        'physique': { name: 'RDV Physique', title: false, data: [], bold: false },
        'telephonique': { name: 'RDV Téléphonique', title: false, data: [], bold: false },
        'carstore': { name: 'RDV CAR/WEB store', title: false, data: [], bold: false },
        'visitePdvSansRdv': { name: 'Visite PDV sans rdv', title: false, data: [], bold: false },
        'transfert': { name: 'Transfert', title: false, data: [], bold: false },
        'autre': { name: 'Status autres', title: true, bold: false },
        'arg_autres': { name: 'Leads argumentés autres', title: false, data: [], bold: true },
        'castoreNonAffectes': { name: 'CAR/WEB store non affecté', title: false, data: [], bold: false },
        'contactParEmail': { name: 'Contact par email avec le PDV', title: false, data: [] }, bold: false,
        'nonInteresse': { name: 'Non intéressé', title: false, data: [], bold: false },
        'mystere': { name: 'Lead mystère', title: false, data: [], bold: false },
        'infructueux_titre': { name: 'Status infructueux', title: true, bold: false },
        'infructueux': { name: 'Leads appels infructueux', title: false, data: [], bold: true },
        'anomalie': { name: 'Anomalie', title: false, data: [], bold: false },
        'faux_num': { name: 'Faux numéro', title: false, data: [], bold: false },
        'injoignable': { name: 'Injoignable', title: false, data: [], bold: false },
        'annulation_precommande': { name: 'Annulation Précommande', title: false, data: [], bold: false },
        'plaisantin': { name: 'Plaisantin', title: false, data: [], bold: false },
        'refusEntretien': { name: 'Refus d\'entretien', title: false, data: [], bold: false },
        'en_cours': { name: 'Status en cours', title: true, bold: false },
        'encours': { name: 'Leads en cours', title: false, data: [], bold: true },
        'nonJoint': { name: 'Non joint + A Rappeler', title: false, data: [], bold: false },
        'recontacteUlterieur': { name: 'Recontact ultérieur', title: false, data: [], bold: false },
        'perf_delai': { name: 'Performance de délai', title: true, bold: false },
        'dmc': { name: 'DMT (min)', title: false, data: [], bold: false },
        'dmt': { name: 'DMC (min)', title: false, data: [], bold: false },
        'wrapup': { name: 'Durée moyenne post appel (min)', title: false, data: [], bold: false },
        'inf20mn': { name: 'numérotation en < 2 Heures', title: false, data: [], bold: false },
    }

    var maxDay = utils.getLastDayOfMonth($scope.search.annee, $scope.search.month-1);
    $scope.labels = ['Total'];
    for (var i = 1; i <= maxDay; i++) {
      var value = i;
      if(i < 10) {
        value = '0'+value;
      }
      $scope.labels.push(value);
    }
  }

  $scope.initFilter = function () {
    var plaque = '', site = '', marque = '';
    if($rootScope.userConnected.user.id_niveau == 2) { // Plaque
      plaque = $rootScope.userConnected.user.code_plaque;
    } else if ($rootScope.userConnected.user.id_niveau == 3) { // Site
      site = $rootScope.userConnected.user.code_site;
      plaque = $rootScope.userConnected.user.code_plaque;
    }
    $scope.search = {
      marque: '',
      month: $scope.currentMonth,
      annee: $scope.currentYear,
      metier: '',
      plaque: plaque,
      site: site,
    };
  } 

  $scope.exportToExcel=function(tableClass) { 
    var exportHref=Excel.tableToExcel(tableClass,'tessst');
    $timeout(function(){location.href=exportHref;},100); 
  }
  
  $scope.formatData = function(data) {
    angular.forEach(data.mapStatusItem, function(e) {
      angular.forEach(Object.keys(e.mapRowItems), function(key) {
        var total = 0;
        var moy = {
          dmc: {nbLigne: 0, total: 0},
          dmt: {nbLigne: 0, total: 0},
          wrapup: {nbLigne: 0, total: 0},
        }

        angular.forEach(e.mapRowItems[key], function(month) {
          total = total + month.value;
          if (key == 'dmt' || key == 'dmc' || key == 'wrapup') {
            moy[key].nbLigne = moy[key].nbLigne + month.nbLigne;
            moy[key].total = moy[key].total + month.total;
          }
        });

        if (key == 'dmt' || key == 'dmc' || key == 'wrapup') {
          total = $filter('number')(moy[key].total / moy[key].nbLigne, 2);
          if(total == '') {
            total = 0;
          }
        }
        $scope.series[key].data.push(total);

        angular.forEach(e.mapRowItems[key], function(month) { 
          var value = month.value;
          if (key == 'dmt' || key == 'dmc' || key == 'wrapup') {
            value = $filter('number')(month.total / month.nbLigne, 2);
            if(value == '') {
              value = 0;
            }
          }
          $scope.series[key].data.push(value);
        });
      });
    });
  }

  $scope.selectMarque = function () {
    crud.selectMarque($scope.search.marque).then(function (d) {
      $scope.listes.plaque = [];
      angular.forEach(d.data, function (e) {
        var nom = e.code_plaque;
        if(e.nom_plaque != null) {
          nom = nom + ' - ' + e.nom_plaque
        }
        $scope.listes.plaque.push(nom.toLowerCase());
      });
    }, function (error) {

    });
  }

  $scope.selectPlaque = function () {
    crud.selectPlaque($scope.search.plaque).then(function (d) {
      $scope.listes.site = [];
      angular.forEach(d.data, function (e) {
        var nom = e.code_site;
        if(e.nom_site != null) {
          nom = nom + ' - ' + e.nom_site
        }
        $scope.listes.site.push(nom.toLowerCase());
      });
    }, function (error) {

    });
  }

  $scope.initListes = function(data) {
    $scope.listes = {
      annee : [],
      marque : [],
      plaque : [],
      site : [],
      metier : [],
    };
    angular.forEach(Object.keys(data.filterPlaque), function(key) {
      var value = key;
      if(data.filterPlaque[key]!=null) {
        var value = value + ' - ' +  data.filterPlaque[key]
      }
      if($scope.listes.plaque.indexOf(value.toLowerCase()) == -1) {
        $scope.listes.plaque.push(value.toLowerCase());
      }
    })
    angular.forEach(Object.keys(data.filterSite), function(key) {
      var value = key;
      if(data.filterSite[key]!=null) {
        var value = value + ' - ' +  data.filterSite[key]
      }
      if($scope.listes.site.indexOf(value.toLowerCase()) == -1) {
        $scope.listes.site.push(value.toLowerCase());
      }
    })
    angular.forEach(data.filterMarque, function(e) {
      if($scope.listes.marque.indexOf(e.trim()) == -1) {
        $scope.listes.marque.push(e.trim());
      }
    })
    angular.forEach(data.filterMetier, function(e) {
      if($scope.listes.metier.indexOf(e.trim()) == -1) {
        $scope.listes.metier.push(e.trim());
      }
    })
    angular.forEach(data.filterYear, function(e) {
      if($scope.listes.annee.indexOf(e) == -1) {
        $scope.listes.annee.push(e);
      }
    })
  }

  $scope.getData = function () {
    $scope.progressbar.start();
    var changeYear = false;
    if($scope.search.annee != $scope.prevAnnee ||
      $scope.search.month != $scope.prevMonth || 
      $scope.firstLoad|| 
      ($scope.search.marque == '' && $scope.search.marque != $scope.prevMarque) || 
      ($scope.search.plaque == '' && $scope.search.plaque != $scope.prevPlaque)
    ) {
      changeYear = true;
    }

    crud.get('Vision', $scope.search, changeYear).then(function (d) {
      if(changeYear) {
        $scope.initListes(d.data.filters);
      }
      if($scope.search.marque != '' && $scope.search.marque != $scope.prevMarque) {
        $scope.selectMarque();
      }
      if($scope.search.plaque != '' && $scope.search.plaque != $scope.prevPlaque) {
        $scope.selectPlaque();
      }

      $scope.initSeries();
      $scope.formatData(d.data);

      $scope.firstLoad = false;
      $scope.prevAnnee = $scope.search.annee;
      $scope.prevMonth = $scope.search.month;
      $scope.prevMarque = $scope.search.marque;
      $scope.prevPlaque = $scope.search.plaque;

      $scope.progressbar.complete();
    }, function (error) {
      $scope.progressbar.complete();
      $rootScope.$broadcast('newAlert', { msg: 'Une erreur est survenue', type: 'danger' });
    });
  }
  $scope.initFilter();
  $scope.setBold = function (serie) {
      if (serie.bold == true) {
          return { "font-weight": "bold" }
      }
  }
})
;