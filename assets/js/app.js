/* global L */

var App;
var NPMap;

App = {
  removeAll: function () {
    for (var i = 0; i < App.checkboxes.length; i++) {
      App.checkboxes[i].checked = false;
    }
    App.update();
  },
  checkboxes: [],
  init: function () {
    var filters = document.getElementById('filters');

    for (var i = 0; i < App.projects.length; i++) {
      var item = filters.appendChild(document.createElement('div'));
      var label = item.appendChild(document.createElement('label'));
      var checkbox = label.appendChild(document.createElement('input'));
      label.appendChild(document.createTextNode(App.projects[i]['name']));
      item.className = 'checkbox';
      checkbox.type = 'checkbox';
      checkbox.id = App.projects[i]['code'];
      checkbox.checked = true;
      checkbox.addEventListener('change', App.update);
      App.checkboxes.push(checkbox);
    }

    var removeAll = filters.appendChild(document.createElement('input'));
    removeAll.type = 'button';
    removeAll.className = 'btn btn-primary';
    removeAll.value = 'Remove All';
    removeAll.addEventListener('click', App.removeAll);
  },
  enabled: {},
  projects: [
    {
      name: 'Climate',
      code: 'CLa01'
    },
    {
      name: 'Elk Aerial',
      code: 'MAa12'
    },
    {
      name: 'Elk Ground',
      code: 'MAa19'
    },
    {
      name: 'Fish Assemblages',
      code: 'FIa10'
    },
    {
      name: 'Forest Vegetation',
      code: 'VCa02'
    },
    {
      name: 'Glacier Monitoring',
      code: 'HYa01'
    },
    {
      name: 'Intertidal',
      code: 'MIa01'
    },
    {
      name: 'Landbirds',
      code: 'BDa03'
    },
    {
      name: 'Mountain Lakes',
      code: 'ACa02'
    },
    {
      name: 'Praire Vegation',
      code: 'VCa03'
    },
    {
      name: 'Subalpine Alpine Vegetation',
      code: 'VCa08'
    },
    {
      name: 'Water Quality',
      code: 'WCa01'
    }
  ],
  update: function () {
    App.enabled = {};

    for (var i = 0; i < App.checkboxes.length; i++) {
      if (App.checkboxes[i].checked) App.enabled[App.checkboxes[i].id] = true;
    }

    NPMap.config.overlays[1].L.eachLayer(function (layer) {
      if (layer.feature.properties.Project_code in App.enabled) {
        NPMap.config.L.addLayer(layer);
      } else {
        NPMap.config.L.removeLayer(layer);
      }
    });
  }
};

NPMap = {
  baseLayers: [
    'nps-parkTilesImagery',
    'nps-darkStreets',
    'nps-lightStreets',
    'nps-neutralTerrain',
    'nps-parkTiles',
    'nps-parkTilesSlate',
    'nps-satelliteNight',
    'mapbox-landsatLive'
  ],
  center: {
    lat: 47.051,
    lng: -121.080
  },
  description: 'North Coast and Cascades Monitoring Locations',
  div: 'map',
  hooks: {
    preinit: function (callback) {
      L.npmap.util._.appendJsFile([
        'http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js'
      ], function () {
        L.npmap.util._.appendJsFile([
          'http://www.nps.gov/lib/bootstrap/3.3.2/js/nps-bootstrap.min.js'
        ], function () {
          L.npmap.util._.appendCssFile([
            'assets/css/app.css',
            'http://www.nps.gov/lib/bootstrap/3.3.2/css/nps-bootstrap.min.css'
          ]);
        });
      });
      callback();
    },
    init: function (callback) {
      App.init();
      callback();
    }
  },
  legendControl: {
    html: '<form id=filters></form>',
    position: 'bottomleft'
  },
  overlays: [{
    clickable: false,
    styles: {
      polygon: {
        'fill': 'transparent'
      }
    },
    type: 'geojson',
    url: 'data/nccn-boundary.geojson'
  },
  {
    filter: function (feature, layer) {
      if (feature.properties.Status === 'Active') {
        return true;
      } else {
        return false;
      }
    },
    popup: {
      title: '<a target="_blank" href={{NCCN_web_link}}>{{Project_title}} - {{Project_code}}</a>',
      description: {
        fields: [
          'Status',
          'Panel',
          'Start_date',
          'Project_type',
          'Location_name'
        ],
        format: 'table'
      }
    },
    styles: {
      line: function (data) {
        switch (data.Project_code) {
          case 'FIa10':
            return {
              'stroke': '#245be3',
              'stroke-width': 8
            };
          case 'VCa03':
            return {
              'stroke': '#d39800',
              'stroke-width': 8
            };
        }
      },
      point: function (data) {
        switch (data.Project_code) {
          case 'ACa02':
            return {
              'marker-color': '#294a5c',
              'marker-size': 'small'
            };
          case 'BDa03':
            return {
              'marker-color': '#882255',
              'marker-size': 'small'
            };
          case 'CLa01':
            return {
              'marker-color': '#6c6c6c',
              'marker-size': 'small'
            };
          case 'HYa01':
            return {
              'marker-color': '#88ccee',
              'marker-size': 'small'
            };
          case 'MAa03':
            return {
              'marker-color': '#d95f02',
              'marker-size': 'small'
            };
          case 'MAa19':
            return {
              'marker-color': '#7a4810',
              'marker-size': 'small'
            };
          case 'MIa01':
            return {
              'marker-color': '#cc6677',
              'marker-size': 'small'
            };
          case 'VCa02':
            return {
              'marker-color': '#117733',
              'marker-size': 'small'
            };
          case 'VCa08':
            return {
              'marker-color': '#fff4ad',
              'marker-size': 'small'
            };
          case 'WCa01':
            return {
              'marker-color': '#245be3',
              'marker-size': 'small'
            };
        }
      }
    },
    tooltip: '{{Project_title}} - {{Location_name}}',
    type: 'geojson',
    url: 'data/monitoring-locations.geojson'
  }],
  title: 'North Coast and Cascades Data Visualizer',
  zoom: 7,
  zoomdisplayControl: {
    position: 'topleft'
  }
};

(function () {
  var s = document.createElement('script');
  s.src = 'http://www.nps.gov/lib/npmap.js/3.0.8/npmap-bootstrap.min.js';
  document.body.appendChild(s);
})();
