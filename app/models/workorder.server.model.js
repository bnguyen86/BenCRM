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
		trim: true
	},
	number: {
		type: String,
		trim: true,
		unique: true
	},
	line_items: [{
		uom: {
			type: String,
			trim: true
		},
		description: {
			type: String,
			trim: true
		},
		qty: {
			type: Number
		},
		price_per_unit: {
			type: Number
		}
	}],	
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