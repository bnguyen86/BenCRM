'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Workorder = mongoose.model('Workorder'),
	_ = require('lodash');

/**
 * Create a Workorder
 */
exports.create = function(req, res) {
	var workorder = new Workorder(req.body);
	workorder.user = req.user;

	workorder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorder);
		}
	});
};

/**
 * Show the current Workorder
 */
exports.read = function(req, res) {
	res.jsonp(req.workorder);
};

/**
 * Update a Workorder
 */
exports.update = function(req, res) {
	var workorder = req.workorder ;

	workorder = _.extend(workorder , req.body);

	workorder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorder);
		}
	});
};

/**
 * Delete an Workorder
 */
exports.delete = function(req, res) {
	var workorder = req.workorder ;

	workorder.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorder);
		}
	});
};

/**
 * List of Workorders
 */
exports.list = function(req, res) { 
	Workorder.find().sort('-created').populate('user', 'displayName').exec(function(err, workorders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorders);
		}
	});
};

/**
 * Workorder middleware
 */
exports.workorderByID = function(req, res, next, id) { 
	Workorder.findById(id).populate('user', 'displayName').exec(function(err, workorder) {
		if (err) return next(err);
		if (! workorder) return next(new Error('Failed to load Workorder ' + id));
		req.workorder = workorder ;
		next();
	});
};

/**
 * Workorder authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.workorder.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
