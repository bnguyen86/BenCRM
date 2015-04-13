'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	RegRequest = mongoose.model('RegRequest'),
	_ = require('lodash');

/**
 * Create a Reg request
 */
exports.create = function(req, res) {
	var regRequest = new RegRequest(req.body);
	regRequest.user = req.user;

	regRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(regRequest);
		}
	});
};

/**
 * Show the current Reg request
 */
exports.read = function(req, res) {
	res.jsonp(req.regRequest);
};

/**
 * Update a Reg request
 */
exports.update = function(req, res) {
	var regRequest = req.regRequest ;

	regRequest = _.extend(regRequest , req.body);

	regRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(regRequest);
		}
	});
};

/**
 * Delete an Reg request
 */
exports.delete = function(req, res) {
	var regRequest = req.regRequest ;

	regRequest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(regRequest);
		}
	});
};

/**
 * List of Reg requests
 */
exports.list = function(req, res) { 
	RegRequest.find().sort('-created').populate('user', 'displayName').exec(function(err, regRequests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(regRequests);
		}
	});
};

/**
 * Reg request middleware
 */
exports.regRequestByID = function(req, res, next, id) { 
	RegRequest.findById(id).populate('user', 'displayName').exec(function(err, regRequest) {
		if (err) return next(err);
		if (! regRequest) return next(new Error('Failed to load Reg request ' + id));
		req.regRequest = regRequest ;
		next();
	});
};

/**
 * Reg request authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.regRequest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};