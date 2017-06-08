/**
 * scripts/ui/map.js
 *
 * This prepares and manages the leaflet map element
 */

'use strict';

const when      = require("when");
when.delay    = require("when/delay");

const map = (function() {

    const mapElement = $("#map");
    const initialCentre = new L.LatLng(49.977722, 14.064453);

    function leaflet() {
        let OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        let map = L.map('map', {
          center: initialCentre,
          zoom: 5,
          layers: [OpenStreetMap_Mapnik]
        });
        let baseMaps = {
            "OpenCycleMap": L.tileLayer(
                "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
            }),
            "Google Aerial": new L.Google()
        };
        L.control.layers(baseMaps).addTo(map);
    }

    function mapbox() {
        mapboxgl.accessToken = 'pk.eyJ1IjoicmVtc3RlciIsImEiOiJjaXF6MnlrYXUwMDY3aTVubmxxdWN2M2htIn0.8FBrAn804OlX9QYW-FRVWA'
        const map = new mapboxgl.Map({
            container  : 'map',
            zoom       : 10,
            center     : initialCentre,
            style      : 'mapbox://styles/mapbox/mapbox.mapbox-terrain-v2',
            bearingSnap: 10,
            dragRotate : false //https://github.com/mapbox/mapbox-gl-js/issues/4297
        });
    }

    mapbox();
    function test() { return true; }

    return {
        test : test
    };

})();

module.exports   = map;