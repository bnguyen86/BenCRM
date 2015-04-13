'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Reg request Schema
 */
var RegRequestSchema = new Schema({
	status: {
		type: String,
		enum: ['Pending', 'Accepted', 'Rejected'],
		default: 'Pending'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	email: {
		type: String,
		required: 'Please fill the email of your Administrator'
	},
	admin: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	company: {
		type: Schema.ObjectId,
		ref: 'Company',
		required: 'Object must be associated with company'
	}
});

mongoose.model('RegRequest', RegRequestSchema);