var express = require('express'),

	// config files
	hosts = require('./config/hosts.json'),
	appConfig = require('./config/app.json'),

	// app modules
	pinger = require('./src/pinger/pinger'),
	renderer = require('./src/renderer/page'),

	// app vars
	hostCache = pinger.start(hosts, appConfig.pingTimerInterval),
	app = express();


// the single route to serve
app.get('/', function (req, res) {
	'use strict';

	// merge host data with alive state to get renderable a datastructure
	var renderData = hosts.map(function (host) {
		// get host data from the config
		var hostData = Object.create(host);
		// check upstate from the hostCache
		hostData.isAlive = hostCache[host.ip] || false;
		return hostData;
	});

	// render page using the renderer module
	res.send(renderer(renderData));
});

app.get('/data.json', function (req, res) {
	'use strict';

	// merge host data with alive state to get renderable a datastructure
	var renderData = hosts.map(function (host) {
		// get host data from the config
		// var hostData = Object.create(host); // wtf?
		var hostData = {ip: host.ip, displayName: host.displayName};
		// check upstate from the hostCache
		hostData.isAlive = hostCache[host.ip] || false;
		return hostData;
	});

	// return data as json
	res.send(renderData);
});

// static file serving
app.use('/public', express.static(__dirname + '/public'));

// start server
app.listen(appConfig.port, function () {
	'use strict';
	console.log('Started server on port %s', appConfig.port);
});