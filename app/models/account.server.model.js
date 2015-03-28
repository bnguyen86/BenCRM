'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Account Schema
 */
var AccountSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Account name',
		trim: true
	},
	address: {
		street: {
			type: String,
			trim: true
		},
		city: {
			type: String,
			trim: true
		},
		province_state: {
			type: String,
			trim: true
		},
		country: {
			type: String,
			trim: true
		},
		postal_zip_code: {
			type: String,
			trim: true,
			uppercase: true
		}
	},
	phone: {
		type: String,
		trim: true
	},
	email: {
		type: String,
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
	contacts: [Schema.Types.Mixed]
});

mongoose.model('Account', AccountSchema);