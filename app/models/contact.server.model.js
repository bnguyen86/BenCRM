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
	},
	company: {
		type: Schema.ObjectId,
		ref: 'Company',
		required: 'Object must be associated with company'
	}

});

mongoose.model('Contact', ContactSchema);