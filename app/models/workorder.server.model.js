'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Workorder Schema
 */
var WorkorderSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Workorder name',
		trim: true
	},
	number: {
		type: String,
		trim: true,
		unique: true
	},
	contacts: [{
		type: Schema.ObjectId,
		ref: 'Contact'
	}],
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

mongoose.model('Workorder', WorkorderSchema);