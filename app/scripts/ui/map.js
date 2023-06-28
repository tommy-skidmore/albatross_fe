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
    const initialCentre = new L.LatLng(36.851703, -76.025203);
    const destCentre = new L.LatLng(36.860540, -76.017505);

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
            style      : 'mapbox://styles/mapbox/outdoors-v11',
            bearingSnap: 10,
            dragRotate : false //https://github.com/mapbox/mapbox-gl-js/issues/4297
        });
        const initial_marker = new mapboxgl.Marker({
            color: "#FF0000",
            draggable: true
        }) 
        .setLngLat(initialCentre)
        .addTo(map)
        .on("dragend", (e)=> {
            console.log('%c[Start Pin] Coordinates:', 'color: red', initial_marker.getLngLat());
        });
        const first_dest_marker = new mapboxgl.Marker({
            color: "#0000FF",
            draggable: true
        })
        .setLngLat(destCentre)
        .addTo(map)
        .on("dragend", (e)=> {
            console.log('%c[End Pin] Coordinates:', 'color: red', first_dest_marker.getLngLat());
        });
            
    }

    mapbox();
    function test() { return true; }

    return {
        test : test
    };

})();

module.exports   = map;