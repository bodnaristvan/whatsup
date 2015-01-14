/* jshint node: true */
(function () {
	'use strict';

	var fs = require('fs'),
		Handlebars = require('handlebars');

	function render(hosts) {
		var rendererDir = require('path').dirname(__filename),
			content = fs.readFileSync(rendererDir + '/templates/page.html', 'utf8'),
			template = Handlebars.compile(content);

		return template({
			hosts: hosts
		});
	}

	module.exports = render;
}());