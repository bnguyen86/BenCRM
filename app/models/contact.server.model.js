'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contact Schema
 */
var ContactSchema = new Schema({
	name: {		
		first: {
			type: String,
			trim: true
		},		
		last: {
			type: String,
			trim: true
		}	
	},
	address: {
		type: String,
		trim: true
	},
	phone: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true
	},
	account: {
		type: Schema.ObjectId,
		ref: 'Account'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Contact', ContactSchema);