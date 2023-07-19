/**
 * scripts/ui/map.js
 *
 * This prepares and manages the leaflet map element
 */

'use strict';
const when      = require("when");
when.delay    = require("when/delay");
//const turf = require('@turf/turf');

let initial_pin_location;
let dest_pin_location;
let obs_pin_location;

const map = (function() {

    const mapElement = $("#map");
    const initialCentre = new L.LatLng(46.9975, 31.9964);
    const destCentre = new L.LatLng(47.00, 32.00);
    const obsCentre = new L.LatLng(46.9999, 32.00);

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
            zoom       : 16,
            center     : initialCentre,
            style      : 'mapbox://styles/mapbox/outdoors-v11',
            bearingSnap: 10,
            dragRotate : false //https://github.com/mapbox/mapbox-gl-js/issues/4297
        });

        const initial_marker = new mapboxgl.Marker({
            color: "#FF0000",
            draggable: true,
            clickTolerance: 10,
        }) 
        .setLngLat(initialCentre)
        .addTo(map)
        .on("dragend", (e)=> {
            initial_pin_location = initial_marker.getLngLat(); //object ipl
            console.log('%c[Start Pin] Coordinates:', 'color: red', initial_pin_location); //log pin location to console
        });
        initial_pin_location = initial_marker.getLngLat();

        const first_dest_marker = new mapboxgl.Marker({
            color: "#0000FF",
            draggable: true,
            clickTolerance: 10
        })
        .setLngLat(destCentre)
        .addTo(map)
        .on("dragend", (e)=> {
            dest_pin_location = first_dest_marker.getLngLat(); //object ipl
            console.log('%c[End Pin] Coordinates:', 'color: blue', dest_pin_location);
        });
        dest_pin_location = first_dest_marker.getLngLat();
        const obs_marker = new mapboxgl.Marker({
            color: "#00FF00",
            draggable: true,
            clickTolerance: 10
        }) 
        .setLngLat(obsCentre)
        .addTo(map)
        .on("dragend", (e)=> {
            obs_pin_location = obs_marker.getLngLat(); //object ipl
            console.log('%c[Obs Pin] Coordinates:', 'color: green', obs_pin_location); //log pin location to console
        });
        obs_pin_location = obs_marker.getLngLat(); //object ipl

        var drone_pos = new mapboxgl.Marker({
            draggable: false
        })
        .setLngLat(initialCentre)
        .addTo(map);
        const confirmButton = document.getElementById('Confirm_Pins');
        confirmButton.addEventListener('click', () => {
            console.log("Console button pressed");
              // Create and dispatch a custom event
            if(dest_pin_location && initial_pin_location && obs_pin_location) {
                 const eventData = {
                    initial_pin_location: initial_pin_location,
                    dest_pin_location: dest_pin_location,
                    obs_pin_location: obs_pin_location
                } //create a single object of both locations
                const customEvent = new CustomEvent('ConfirmPinSelected', {
                    detail: {eventData} // Pass any data you want with the event
                    });
                    window.dispatchEvent(customEvent);
            }
            else {
                console.log("Please update both takeoff, obstacle and destination locations on map.");
                alert("Please update both takeoff and destination locations on the map.");
            }
          });
         window.addEventListener('updateMarkerPosition', (event) => {
            const lnglat = event.detail;
            drone_pos.setLngLat(lnglat);
        });

// Export the marker instance       
    }

    mapbox();
    function test() { return true; }
    return {
        test : test
    };
    

})();

module.exports   = map;
