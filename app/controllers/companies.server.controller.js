'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Company = mongoose.model('Company'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Company
 */
exports.create = function(req, res) {
	var company = new Company(req.body);
	company.user = req.user;

	company.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			User.update({ _id: req.user._id }, { $set: { company: company._id }}, function(err){
				if(err){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
			});

			res.jsonp(company);
		}
	});
};

/**
 * Show the current Company
 */
exports.read = function(req, res) {
	if(req.company._id.toString() !== req.user.company.toString()){
		return res.status(403).send('User is not authorized');
	} else res.jsonp(req.company);
};

/**
 * Update a Company
 */
exports.update = function(req, res) {
	var company = req.company ;

	company = _.extend(company , req.body);

	company.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(company);
		}
	});
};

/**
 * Delete an Company
 */
exports.delete = function(req, res) {
	var company = req.company ;

	company.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(company);
		}
	});
};

/**
 * List of Companies
 */
exports.list = function(req, res) { 
	if (!_.intersection(req.user.roles, ['super_admin']).length){
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	Company.find().sort('-created').populate('user', 'displayName').exec(function(err, companies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(companies);
		}
	});
};

/**
 * Company middleware
 */
exports.companyByID = function(req, res, next, id) { 
	Company.findById(id).populate('user', 'displayName').exec(function(err, company) {
		if (err) return next(err);
		if (! company) return next(new Error('Failed to load Company ' + id));
		req.company = company ;
		next();
	});
};

/**
 * Company authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.company.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }

	if (_.intersection(req.user.roles, ['admin', 'super_admin']).length) {
		return next();
	} else {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
