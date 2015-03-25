'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var workorders = require('../../app/controllers/workorders.server.controller');

	// Workorders Routes
	app.route('/workorders')
		.get(workorders.list)
		.post(users.requiresLogin, workorders.create);

	app.route('/workorders/:workorderId')
		.get(workorders.read)
		.put(users.requiresLogin, workorders.hasAuthorization, workorders.update)
		.delete(users.requiresLogin, workorders.hasAuthorization, workorders.delete);

	// Finish by binding the Workorder middleware
	app.param('workorderId', workorders.workorderByID);
};
