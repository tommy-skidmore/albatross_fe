/**
 * scripts/ui/map.js
 *
 * This prepares and manages the leaflet map element
 */

'use strict';

var when      = require("when");
when.delay    = require("when/delay");

var map = (function() {

    var mapElement = $("#map");
    var mapWrap    = $("#mapWrap")

    var initialCentre = new L.LatLng(49.977722, 14.064453);
    var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    var map = L.map('map', {
      center: initialCentre,
      zoom: 5,
      layers: [OpenStreetMap_Mapnik]
    });
    var baseMaps = {
        "OpenCycleMap": L.tileLayer(
            "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
        }),
        "Google Aerial": new L.Google()
    };
    L.control.layers(baseMaps).addTo(map);

    function test() { return true; }

    return {
        test : test
    };

})();

module.exports   = map;