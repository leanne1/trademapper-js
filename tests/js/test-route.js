define(
	['QUnit', 'trademapper.route', 'd3'],
	function(q, route, d3) {
		"use strict";
		var pointL1, pointL2, pointC1, pointC2;

		var run = function() {
			q.module("PointLatLong module", {
				setup: function() {
					// set a default function - required before we can create points
					route.setLatLongToPointFunc(function() { return [3, 4]; });
				}
			});

			q.test('check PointLatLong sets point using latLongToPointFunc', function() {
				var point = new route.PointLatLong(5, 6);
				q.equal(5, point.latlong[0], 'The x of latlong should be 5');
				q.equal(6, point.latlong[1], 'The y of latlong should be 6');
				q.equal(3, point.point[0], 'The x of point should be 3');
				q.equal(4, point.point[1], 'The y of point should be 4');
			});

			q.test('check PointLatLong toString() includes lat and long', function() {
				var point = new route.PointLatLong(5.34, 6.12);
				var pointString = point.toString();
				q.ok(pointString.indexOf("5.34") > -1);
				q.ok(pointString.indexOf("6.12") > -1);
			});

			q.test('check PointLatLong toString() is same for two points with same lat/long', function() {
				var point1 = new route.PointLatLong(5.34, 6.12);
				var point2 = new route.PointLatLong(5.34, 6.12);
				q.equal(point1.toString(), point2.toString());
			});

			q.module("PointCountry module", {
				setup: function() {
					// set a default function - required before we can create points
					route.setCountryGetPointFunc(function() { return [8, 9]; });
				}
			});

			q.test('check PointCountry sets point using countryGetPointFunc', function() {
				var point = new route.PointCountry("GB");
				q.equal("GB", point.countryCode, 'The countryCode should be "GB"');
				q.equal(8, point.point[0], 'The x of point should be 8');
				q.equal(9, point.point[1], 'The y of point should be 9');
			});

			q.test('check PointCountry toString() includes country code', function() {
				var point = new route.PointCountry("KE");
				var pointString = point.toString();
				q.ok(pointString.indexOf("KE") > -1);
			});

			q.test('check PointCountry toString() is same for two points with same country code', function() {
				var point1 = new route.PointCountry("ZA");
				var point2 = new route.PointCountry("ZA");
				q.equal(point1.toString(), point2.toString());
			});

			q.module("BothPoint module", {
				setup: function() {
					// set a default function - required before we can create points
					route.setLatLongToPointFunc(function() { return [3, 4]; });
					route.setCountryGetPointFunc(function() { return [8, 9]; });
					pointL1 = new route.PointLatLong(5.34, 6.12);
					pointL2 = new route.PointLatLong(5.34, 6.12);
					pointC1 = new route.PointCountry("ZA");
					pointC2 = new route.PointCountry("GB");
				}
			});

			q.test('check Route toString() contains strings for all points', function() {
				var route1 = new route.Route([pointL1, pointC1, pointC2], 20);

				var routeString = route1.toString();
				q.ok(routeString.indexOf(pointL1.toString()) > -1);
				q.ok(routeString.indexOf(pointC1.toString()) > -1);
				q.ok(routeString.indexOf(pointC2.toString()) > -1);
			});

			q.test('check Route toString() is same for two routes with same points in same order', function() {
				var route1 = new route.Route([pointL1, pointC1, pointC2], 20);
				var route2 = new route.Route([pointL1, pointC1, pointC2], 20);

				q.equal(route1.toString(), route2.toString());
			});

			q.test('check Route toString() is different for two routes with same points in different order', function() {
				var route1 = new route.Route([pointL1, pointC1, pointC2], 20);
				var route2 = new route.Route([pointL1, pointC2, pointC1], 20);

				q.notEqual(route1.toString(), route2.toString());
			});

			q.test('check RouteCollection adds new routes not in it currently', function() {
				var route1 = new route.Route([pointL1, pointC1, pointC2], 20);
				var route2 = new route.Route([pointL1, pointC2, pointC1], 20);

				var collection = new route.RouteCollection();
				q.equal(0, collection.routeCount());
				collection.addRoute(route1);
				q.equal(1, collection.routeCount());
				collection.addRoute(route2);
				q.equal(2, collection.routeCount());
			});

			q.test('check RouteCollection combines weight of routes with same points in same order', function() {
				var route1 = new route.Route([pointL1, pointC1, pointC2], 20);
				var route2 = new route.Route([pointL1, pointC1, pointC2], 10);

				var collection = new route.RouteCollection();
				q.equal(0, collection.routeCount());
				collection.addRoute(route1);
				q.equal(1, collection.routeCount());
				q.equal(20, collection.getRoutes()[0].weight);
				collection.addRoute(route2);
				q.equal(1, collection.routeCount());
				q.equal(30, collection.getRoutes()[0].weight);
			});

			q.test('check RouteCollection maxWeight returns 0 when it has no routes', function() {
				var collection = new route.RouteCollection();
				q.equal(collection.maxWeight(), 0);
			});

			q.test('check RouteCollection maxWeight returns 0 when it has one route', function() {
				var collection = new route.RouteCollection(),
					route1 = new route.Route([pointL1, pointC1, pointC2], 20);
				collection.addRoute(route1);
				q.equal(collection.maxWeight(), 20);
			});

			q.test('check RouteCollection maxWeight returns max when it has multiple routes', function() {
				var collection = new route.RouteCollection(),
					route1 = new route.Route([pointL1, pointC1], 10),
					route2 = new route.Route([pointC1, pointC2], 30),
					route3 = new route.Route([pointL1, pointC2], 20);
				collection.addRoute(route1);
				collection.addRoute(route2);
				collection.addRoute(route3);
				q.equal(collection.maxWeight(), 30);
			});

		};
		return {run: run};
	}
);
