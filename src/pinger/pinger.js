/* jshint node: true */
(function () {
	'use strict';

	// starts the pinger service, returning a cache of pinged hosts state, running 
	// ping checks every X seconds
	var exec = require('child_process').exec,
		hostCache = {},
		interval, publicAPI, privateAPI;

	privateAPI = {
		ping: function (host) {
			exec('ping -c 2 -n -q -W 1 ' + host.ip, function (error) {
				hostCache[host.ip] = !error;
			});
		},
		pingAll: function (hosts) {
			hosts.forEach(privateAPI.ping);
		}
	};

	publicAPI = {
		start: function (hosts, intervalSec) {
			// run the initial ping check
			privateAPI.pingAll(hosts);
			// also start an interval for ping re-checks
			interval = setInterval(privateAPI.pingAll.bind(this, hosts), intervalSec * 1000);
			// return the host state cache
			return hostCache;
		},
		stop: function () {
			clearInterval(interval);
		}
	};

	module.exports = publicAPI;
}());