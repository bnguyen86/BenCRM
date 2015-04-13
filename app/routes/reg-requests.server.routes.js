'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var regRequests = require('../../app/controllers/reg-requests.server.controller');

	// Reg requests Routes
	app.route('/reg-requests')
		.get(regRequests.list)
		.post(users.requiresLogin, regRequests.create);

	app.route('/reg-requests/:regRequestId')
		.get(regRequests.read)
		.put(users.requiresLogin, regRequests.hasAuthorization, regRequests.update)
		.delete(users.requiresLogin, regRequests.hasAuthorization, regRequests.delete);

	// Finish by binding the Reg request middleware
	app.param('regRequestId', regRequests.regRequestByID);
};
