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
let obs_pin1_location;
let obs_pin2_location;


const map = (function() {

    const mapElement = $("#map");
    const initialCentre = new L.LatLng(46.9975, 31.9964);
    const destCentre = new L.LatLng(46.99752, 31.99753);
    const obsCentre2 = new L.LatLng(46.99751, 31.99714);
    const obsCentre1 = new L.LatLng(46.99751, 31.99674);
    const droneCentre = new L.LatLng(0, 0); //default pin locations

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
            color: "#00FF00",
            draggable: true,
            clickTolerance: 10,
        }) 
        .setLngLat(initialCentre)
        .addTo(map)
        .setPopup(new mapboxgl.Popup().setHTML("<p style='color: green'>Starting Location</p>"))
        .on("dragend", (e)=> {
            initial_pin_location = initial_marker.getLngLat(); //object ipl
            console.log('%c[Start Pin] Coordinates:', 'color: green', initial_pin_location); //log pin location to console
        });

        const dest_marker = new mapboxgl.Marker({
            color: "#FF00FF",
            draggable: true,
            clickTolerance: 10
        })
        .setLngLat(destCentre)
        .addTo(map)
        .setPopup(new mapboxgl.Popup().setHTML("<p style='color: pink'>Destination Pin</p>"))
        .on("dragend", (e)=> {
            dest_pin_location = dest_marker.getLngLat(); //object ipl
            console.log('%c[End Pin] Coordinates:', 'color: pink', dest_pin_location);
        });
        console.log(dest_marker.getPopup()); // return the popup instance
        dest_pin_location = dest_marker.getLngLat();

        const obs_marker1 = new mapboxgl.Marker({
            color: "#FF0000",
            draggable: true,
            clickTolerance: 10
        }) 
        .setLngLat(obsCentre1)
        .addTo(map)
        .setPopup(new mapboxgl.Popup().setHTML("<p style='color: red'>Obstacle 1 Pin</p>"))
        .on("dragend", (e)=> {
            obs_pin1_location = obs_marker1.getLngLat(); //object ipl
            console.log('%c[Obs 1 Pin] Coordinates:', 'color: red', obs_pin1_location); //log pin location to console
        });
        obs_pin1_location = obs_marker1.getLngLat(); //object ipl

        const obs_marker2 = new mapboxgl.Marker({
            color: "#C00000",
            draggable: true,
            clickTolerance: 10
        }) 
        .setLngLat(obsCentre2)
        .addTo(map)
        .setPopup(new mapboxgl.Popup().setHTML("<p style='color: red'>Obstacle 2 Pin</p>"))
        .on("dragend", (e)=> {
            obs_pin2_location = obs_marker2.getLngLat(); //object ipl
            console.log('%c[Obs 2 Pin] Coordinates:', 'color: red', obs_pin2_location); //log pin location to console
        });
        obs_pin2_location = obs_marker2.getLngLat(); //object ipl

        var drone_pos = new mapboxgl.Marker({
            draggable: false,
            color: "FFFF00"
        })
        .setLngLat(droneCentre)
        .addTo(map)
        .setPopup(new mapboxgl.Popup().setHTML("<p style='color: black'>Current Drone Location</p>"));

        const confirmButton = document.getElementById('Confirm_Pins');
        confirmButton.addEventListener('click', () => {
            console.log("Console button pressed");
              // Create and dispatch a custom event
            if(initial_pin_location && dest_pin_location && initial_pin_location && obs_pin1_location && obs_pin2_location) {
                 const eventData = {
                    initial_pin_location: initial_pin_location,
                    dest_pin_location: dest_pin_location,
                    obs_pin1_location: obs_pin1_location,
                    obs_pin2_location: obs_pin2_location

                } //create a single object of both locations
                const customEvent = new CustomEvent('ConfirmPinSelected', {
                    detail: {eventData} // Pass any data you want with the event
                    });
                    window.dispatchEvent(customEvent);
            }
            else {
                console.log("Please update takeoff location on map.");
                alert("Please update takeoff location on map."); 
                //takeoff location must be updated to correctly update instance of sim
            }
          });
         window.addEventListener('updateMarkerPosition', (event) => {
            const lnglat = event.detail;
            drone_pos.setLngLat(lnglat); //update drone pin based on recieved telemetry data
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
