global.zikes = {};

/*
 * proxyquireify used througout this test suite causes some modules
 * to be loaded multiple times. L.map() doesn't like to be called twice though.
 */
var _map = undefined;
var Leaflet = L;
L = {}
for (elemName in Leaflet) {
	L[elemName] = Leaflet[elemName];
}
L.map = function() {
	if (!_map) {
		_map = Leaflet.map.apply(this, arguments);
	}
	return _map;
};