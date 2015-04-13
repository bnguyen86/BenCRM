'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Job Schema
 */
var JobSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	contacts: [{
		type: Schema.ObjectId,
		ref: 'Contact'
	}],
	account: {
		type: Schema.ObjectId,
		ref: 'Account'
	},
	assigned: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	status:{
		type: String,
		enum: ['Open', 'Completed', 'Assigned', 'Cancelled'],
		default: 'Open'
	},
	company: {
		type: Schema.ObjectId,
		ref: 'Company',
		required: 'Object must be associated with company'
	}
});

mongoose.model('Job', JobSchema);