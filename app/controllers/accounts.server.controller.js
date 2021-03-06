'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Account = mongoose.model('Account'),
	_ = require('lodash');

/**
 * Create a Account
 */
exports.create = function(req, res) {
	var account = new Account(req.body);
	account.user = req.user;
	account.company = req.user.company;

	account.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * Show the current Account
 */
exports.read = function(req, res) {
	if(errorHandler.checkCompany(req.account, req, res))
		res.jsonp(req.account);
};

/**
 * Update a Account
 */
exports.update = function(req, res) {
	var account = req.account ;	
	if(!errorHandler.checkCompany(account, req, res))
		return;

	account = _.extend(account , req.body);

	account.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * Delete an Account
 */
exports.delete = function(req, res) {
	var account = req.account ;
	if(!errorHandler.checkCompany(account, req, res))
		return;

	account.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * List of Accounts
 */
exports.list = function(req, res) { 
	Account.find().where('company').equals(req.user.company).sort('-created').populate('user', 'displayName').exec(function(err, accounts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(accounts);
		}
	});
};

/**
 * Account middleware
 */
exports.accountByID = function(req, res, next, id) { 
	Account.findById(id).populate('user', 'displayName').exec(function(err, account) {
		if (err) return next(err);
		if (! account) return next(new Error('Failed to load Account ' + id));		
		req.account = account ;

		var Contact = mongoose.model('Contact');
		Contact.find({account : account._id}).sort('-created').exec(function(err, contacts) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.account.contacts = contacts;
				next();
			}
		});
	
	});
};

/**
 * Account authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.account.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
