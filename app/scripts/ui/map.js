/**
 * scripts/ui/map.js
 *
 * This prepares and manages the leaflet map element
 */

'use strict';
const when      = require("when");
when.delay    = require("when/delay");
//const turf = require('@turf/turf');

// let resolveButtonEvent;

// function Listen_ConfirmPins(pin_location1) {
//     const confirmButton = document.getElementById('Confirm_Pins');
//     confirmButton.addEventListener('click', () => {
//         console.log("Console button pressed");
//         //const coordinates = //initial_marker.convert([longitude, latitude]);
//         resolveButtonEvent();
//       });
// }

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
            draggable: true,
            clickTolerance: 10
        }) 
        .setLngLat(initialCentre)
        .addTo(map)
        .on("dragend", (e)=> {
            const initial_pin_location = initial_marker.getLngLat(); //object ipl
            console.log('%c[Start Pin] Coordinates:', 'color: red', initial_pin_location); //log pin location to console
        })
        const first_dest_marker = new mapboxgl.Marker({
            color: "#0000FF",
            draggable: true,
            clickTolerance: 10
        })
        .setLngLat(destCentre)
        .addTo(map)
        .on("dragend", (e)=> {
            console.log('%c[End Pin] Coordinates:', 'color: red', first_dest_marker.getLngLat());
        })
        //Listen_ConfirmPins(initial_marker.getLngLat());
    }

    mapbox();
    function test() { return true; }
    return {
        test : test
    };

});

export const waitForButtonEvent = () => {
    return new Promise((resolve) => {
    resolveButtonEvent = resolve;
   });
}

module.exports   = map;

var createGeoJSONCircle = function(center, radiusInKm, points) {
    if(!points) points = 64;

    var coords = {
        latitude: center[0],
        longitude: center[1]
    };

    var km = radiusInKm;

    var ret = [];
var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
var distanceY = km/110.574;

var theta, x, y;
for(var i=0; i<points; i++) {
    theta = (i/points)*(2*Math.PI);
    x = distanceX*Math.cos(theta);
    y = distanceY*Math.sin(theta);

    ret.push([coords.longitude+x, coords.latitude+y]);
}
ret.push(ret[0]);

return {
    "type": "geojson",
    "data": {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [ret]
            }
        }]
    }
};
};