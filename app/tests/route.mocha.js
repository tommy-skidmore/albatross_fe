var assert       = require("assert");
var when         = require("when");
var mocks        = require("./mocks.js");

var proxyquire = require('proxyquireify')(require);

var stubs = {
  "./http.js": {
      get: function ()  { return when('wirklich wunderbar'); },
      post: function () { return when('schokolade'); }
  },
  "@noCallThru": true
};
var routeModule  = proxyquire("../scripts/ui/mapRoute.js", stubs);


var mockServerRouteMeta = {
    avgLookup_us:48,minLookup_us:33,maxLookup_us:62,routing_us:44,lengthMts:175,routingRequests:[{name:"astar",visitedJunctions:19}]
};

suite("Route", function() {

  suite("a->b", function() {
    var from  = [51.53471082602534,-0.09864091873168945];
    var to    = [51.535625123266826, -0.09711742401123047];
    var route = [[51.5347251892,-0.0986673012376,25,12],[51.5348167419,-0.0984451025724],[51.5350036621,-0.0981288999319],[51.5350379944,-0.0980743989348,24,12],[51.5352020264,-0.0977929979563,24,12],[51.5353393555,-0.0975619032979,24,12],[51.5356178284,-0.0971324965358]];

    test("should (de)serialse both ways", function(done) {
        var routeUnderTest = new routeModule.Route({
            route : function(milestones) {
                return when({
                    waypoints: route.slice(),
                    meta: mockServerRouteMeta
                });
            },
            invalidate: function() {
            }
        });
        routeUnderTest.from(from);
        routeUnderTest.to(to);
        when(routeUnderTest.invalidate(true))
        .then(function() {
            assert.deepEqual(routeUnderTest.toJSON(), [{
                from:from,
                waypoints:route
            },{
                from:to
            }]);
            var distanceFromProfileMts = routeUnderTest.mHead.mProfile.reduce(
                function(cum, elem) { return cum+elem.fromPrevJntnMts;}, 0
            );
            assert.equal(distanceFromProfileMts, 101); //it differs as the last node has no elevation
            assert.equal(routeUnderTest.getDistanceMts(), 143);
        })
        .otherwise(function(err) {
            done(err);
        })
        .then(function() {
            done();
        });
    });
  });

  suite("a->b->c", function() {
    var from  = [51.11068260551611, 17.042986750602722];
    var via   = [51.11151446387264, 17.043635845184326];
    var to    = [51.110685973393885, 17.044392228126526];
    var route = [[51.110660553,17.0430202484,119,12],[51.1107597351,17.0430164337],[51.1114082336,17.0429801941],[51.1114845276,17.0429458618,118,12],[51.1114807129,17.0431289673,119],[51.1114845276,17.043636322,120,12],[51.111492157,17.0441608429],[51.1114883423,17.0443534851,122,12],[51.1106758118,17.0443534851,122]];

    function prepareRoute(parent) {
        var routeUnderTest = new routeModule.Route(parent);
        routeUnderTest.from(from);
        routeUnderTest.to(to);
        new routeModule.Section(routeUnderTest, {
            latlng   : via,
            prev     : routeUnderTest.mHead,
            next     : routeUnderTest.mHead.tail(),
            opacity  : 0.5,
            iconClass: 'toFromIcon'
        }).onDragEnd();
        return routeUnderTest;
    }

    function prepareParent() {
        var mockParent = new mocks.MockObject();
        mockParent["route"] = new mocks.MockInvocation()
        .returns(function() {
            return {
                waypoints: route.slice(),
                meta: mockServerRouteMeta
            };
        }).method;
        mockParent["invalidate"] = new mocks.MockInvocation().method;
        return mockParent;
    }

    test("should (de)serialse a complex a->b->c route", function(done) {
        var parent = prepareParent();
        var routeUnderTest = prepareRoute(parent);
        when(routeUnderTest.invalidate())
        .then(function() {
            assert.deepEqual(routeUnderTest.toJSON(), [
                {
                    from: from,
                    waypoints: route.slice(0,6)
                },
                {
                    from: via,
                    waypoints: route.slice(5)
                },
                {
                    from: to
                }
            ]);
            assert.equal(parent.invalidate.calledTimes(), 2);
            assert.equal(parent.route.calledTimes([from,via,to]), 2);
        })
        .otherwise(function(err) {
            done(err);
        })
        .then(function() {
            done();
        });
    });


    test("should delete a marker and reroute", function(done) {
        var parent = prepareParent();
        var routeUnderTest = prepareRoute(parent);
        parent.invalidate.whenCalled()
        .then(function() {
            routeUnderTest.mHead.mNext.delete();
        });
        parent.invalidate.whenCalled(undefined, 2)
        .then(function() {
            assert.equal(parent.route.calledTimes([from,to]), 1);
            assert.equal(routeUnderTest.mHead.mNext.mNext, undefined);
            done();
        })
        .otherwise(function(err) {
            done(err);
        });
    });
  });
});