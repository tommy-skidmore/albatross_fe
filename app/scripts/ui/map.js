/**
 * scripts/ui/map.js
 *
 * This prepares and manages the leaflet map element
 */

'use strict';
const when      = require("when");
when.delay    = require("when/delay");
//const turf = require('@turf/turf');

//let initial_pin_location;
let dest_pin_location;

const map = (function() {

    const mapElement = $("#map");
    const initialCentre = new L.LatLng(46.9975, 31.9964);
    const destCentre = new L.LatLng(46.9979, 31.9969);

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

    function mapbox(socket) {
        mapboxgl.accessToken = 'pk.eyJ1IjoicmVtc3RlciIsImEiOiJjaXF6MnlrYXUwMDY3aTVubmxxdWN2M2htIn0.8FBrAn804OlX9QYW-FRVWA'
        const map = new mapboxgl.Map({
            container  : 'map',
            zoom       : 16,
            center     : initialCentre,
            style      : 'mapbox://styles/mapbox/outdoors-v11',
            bearingSnap: 10,
            dragRotate : false //https://github.com/mapbox/mapbox-gl-js/issues/4297
        });
        const initial_marker = new mapboxgl.Marker({
            color: "#FF0000",
            draggable: false,
            clickTolerance: 10
        }) 
        .setLngLat(initialCentre)
        .addTo(map)
        // .on("dragend", (e)=> {
        //     initial_pin_location = initial_marker.getLngLat(); //object ipl
        //     console.log('%c[Start Pin] Coordinates:', 'color: red', initial_pin_location); //log pin location to console
        // });
        const first_dest_marker = new mapboxgl.Marker({
            color: "#0000FF",
            draggable: true,
            clickTolerance: 10
        })
        .setLngLat(destCentre)
        .addTo(map)
        .on("dragend", (e)=> {
            dest_pin_location = first_dest_marker.getLngLat(); //object ipl
            console.log('%c[End Pin] Coordinates:', 'color: green', dest_pin_location);
        });

        const confirmButton = document.getElementById('Confirm_Pins');
        confirmButton.addEventListener('click', () => {
            console.log("Console button pressed");
              // Create and dispatch a custom event
            if(dest_pin_location) {
                 const eventData = {
                //     initial_pin_location: initial_pin_location,
                    dest_pin_location: dest_pin_location
                } //create a single object of both locations
                const customEvent = new CustomEvent('ConfirmPinSelected', {
                    detail: {eventData} // Pass any data you want with the event
                    });
                    window.dispatchEvent(customEvent);
            }
            else {
                console.log("Please update both takeoff and destination locations on map.");
                alert("Please update both takeoff and destination locations on the map.");
            }

          });

            
    }

    mapbox();
    function test() { return true; }
    return {
        test : test
    };

})();

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