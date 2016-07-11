angular.module('common.modules')
.controller('annuel', function($scope, $rootScope, crud, utils, ngProgressFactory, $filter, Excel, $timeout) {
  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.currentYear = utils.getCurrentYear();
  $scope.firstLoad = true;
  $scope.prevAnnee = $scope.currentYear;
  $scope.prevMarque = '';
  $scope.prevPlaque = '';



  $scope.labels = ['Total', '%','Jan', '%','Fev', '%','Mar', '%','Avr', '%','Mai', '%','Jui', '%','Juil', '%','Août',
  '%','Sept', '%','Oct', '%','Nov', '%','Dec', '%'];


  $scope.$watch('search', function() {
    $scope.getData();
  }, true);

  $scope.resetFilter = function (filter) {
    if(filter == 'annee') {
      $scope.search[filter] = $scope.currentYear;
    } else {
      $scope.search[filter] = '';
    }
  }

  $scope.exportToExcel=function(tableClass) { 
    var exportHref=Excel.tableToExcel(tableClass,'tessst');
    $timeout(function(){location.href=exportHref;},100); 
  }

  $scope.initSeries = function () {
    $scope.series = {
      'status_general' : {name: 'Status général', title: true , bold :false},
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
      'contactParEmail': { name: 'Contact par email avec le PDV', title: false, data: [], bold: false },
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
      month: 0,
      annee: $scope.currentYear,
      metier: '',
      plaque: plaque,
      site: site,
    };
  } 
  $scope.getPercent = function (key, values) {
    var value = 0
    if(key == 'lead_traites' || key == 'lead_encours' || key == 'lead_argumentes' || key == 'nonJoint' || 
      key == 'recontacteUlterieur' || key == 'encours' || key == 'inf20mn') {
      value = $filter('number')(values.grand * 100 / values.lead_recus, 2);
    } else if (key == 'infructueux' || key == 'anomalie' || key == 'faux_num' || key == 'plaisantin' || 
      key == 'annulation_precommande' || key == 'injoignable' || key == 'refusEntretien' || 
      key == 'arg_autres' || key == 'arg_positifs') {
      value = $filter('number')(values.grand * 100 / values.lead_traites, 2);
    } else if (key == 'castoreNonAffectes' || key == 'contactParEmail' || key == 'nonInteresse' ||
      key == 'mystere' || key == 'physique' || key == 'telephonique' || key == 'carstore' || 
      key == 'visitePdvSansRdv' || key == 'transfert') {
      value = $filter('number')(values.grand * 100 / values.lead_argumentes, 2);
    } else if (key == 'dmt' || key == 'dmc' || key == 'wrapup') {
      value = '-';
    } else {
      value = 100;
    }
    if(value == '' || value == 0.00) value = 0;
    return value;
  }

  $scope.formatData = function(data) {
    var totals = {
      grand: 0,
      lead_recus: 0,
      lead_traites: 0,
      lead_argumentes: 0,
      dmt: { nbLigne: 0, total: 0 },
      dmc: { nbLigne: 0, total: 0 },
      wrapup: { nbLigne: 0, total: 0 },
    }
    
    angular.forEach(data.mapStatusItem, function(e) {
      angular.forEach(Object.keys(e.mapRowItems), function(key) {
        totals.grand = 0;
        if(e.mapRowItems['lead_recus'] != undefined) {
          $scope.lead_recus = e.mapRowItems['lead_recus'];
          $scope.lead_traites = e.mapRowItems['lead_traites'];
          $scope.lead_argumentes = e.mapRowItems['lead_argumentes'];
        }

        angular.forEach(e.mapRowItems[key], function(month) {
          if(key == 'lead_recus') { totals.lead_recus = totals.lead_recus + month.value; }
          if(key == 'lead_traites') { totals.lead_traites = totals.lead_traites + month.value; }
          if(key == 'lead_argumentes') { totals.lead_argumentes = totals.lead_argumentes + month.value; }
          if (key == 'dmt' || key == 'dmc' || key == 'wrapup') {
            totals[key].nbLigne = totals[key].nbLigne + month.nbLigne;
            totals[key].total = totals[key].total + month.total;
          }
          totals.grand = (totals.grand + parseFloat($filter('filterPercent')(month.value)));
        });

        var value = totals.grand;
        if (key == 'dmt' || key == 'dmc' || key == 'wrapup') {
          value = $filter('number')(totals[key].total / totals[key].nbLigne, 2);
          if(value == '') {
            value = 0;
          }
        }
        
        $scope.series[key].data.push(value);
        var percent = $scope.getPercent(key, totals);
        $scope.series[key].data.push(percent);



        var i = 0;
        angular.forEach(e.mapRowItems[key], function(month) {
          var values = {
            grand : month.value,
            lead_recus : $scope.lead_recus[i].value,
            lead_traites : $scope.lead_traites[i].value,
            lead_argumentes : $scope.lead_argumentes[i].value,
          }

          var value = parseFloat($filter('filterPercent')(month.value));
          if (key == 'dmt' || key == 'dmc' || key == 'wrapup') {
            value = $filter('number')(month.total / month.nbLigne, 2);
            if(value == '') {
              value = 0;
            }
          }

          $scope.series[key].data.push(value);  
          var percent = $scope.getPercent(key, values);
          $scope.series[key].data.push(percent);
          i++;
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
      $scope.firstLoad || 
      ($scope.search.marque == '' && $scope.search.marque != $scope.prevMarque) || 
      ($scope.search.plaque == '' && $scope.search.plaque != $scope.prevPlaque)
    ) {
      changeYear = true;
    }


    crud.get('Vision', $scope.search, changeYear).then(function (d) {
      console.log(d.data);
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
          return { "font-weight" : "bold" }
      }
  }
});