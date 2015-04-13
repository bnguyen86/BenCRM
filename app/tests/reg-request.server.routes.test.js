'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RegRequest = mongoose.model('RegRequest'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, regRequest;

/**
 * Reg request routes tests
 */
describe('Reg request CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Reg request
		user.save(function() {
			regRequest = {
				name: 'Reg request Name'
			};

			done();
		});
	});

	it('should be able to save Reg request instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reg request
				agent.post('/reg-requests')
					.send(regRequest)
					.expect(200)
					.end(function(regRequestSaveErr, regRequestSaveRes) {
						// Handle Reg request save error
						if (regRequestSaveErr) done(regRequestSaveErr);

						// Get a list of Reg requests
						agent.get('/reg-requests')
							.end(function(regRequestsGetErr, regRequestsGetRes) {
								// Handle Reg request save error
								if (regRequestsGetErr) done(regRequestsGetErr);

								// Get Reg requests list
								var regRequests = regRequestsGetRes.body;

								// Set assertions
								(regRequests[0].user._id).should.equal(userId);
								(regRequests[0].name).should.match('Reg request Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Reg request instance if not logged in', function(done) {
		agent.post('/reg-requests')
			.send(regRequest)
			.expect(401)
			.end(function(regRequestSaveErr, regRequestSaveRes) {
				// Call the assertion callback
				done(regRequestSaveErr);
			});
	});

	it('should not be able to save Reg request instance if no name is provided', function(done) {
		// Invalidate name field
		regRequest.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reg request
				agent.post('/reg-requests')
					.send(regRequest)
					.expect(400)
					.end(function(regRequestSaveErr, regRequestSaveRes) {
						// Set message assertion
						(regRequestSaveRes.body.message).should.match('Please fill Reg request name');
						
						// Handle Reg request save error
						done(regRequestSaveErr);
					});
			});
	});

	it('should be able to update Reg request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reg request
				agent.post('/reg-requests')
					.send(regRequest)
					.expect(200)
					.end(function(regRequestSaveErr, regRequestSaveRes) {
						// Handle Reg request save error
						if (regRequestSaveErr) done(regRequestSaveErr);

						// Update Reg request name
						regRequest.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Reg request
						agent.put('/reg-requests/' + regRequestSaveRes.body._id)
							.send(regRequest)
							.expect(200)
							.end(function(regRequestUpdateErr, regRequestUpdateRes) {
								// Handle Reg request update error
								if (regRequestUpdateErr) done(regRequestUpdateErr);

								// Set assertions
								(regRequestUpdateRes.body._id).should.equal(regRequestSaveRes.body._id);
								(regRequestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Reg requests if not signed in', function(done) {
		// Create new Reg request model instance
		var regRequestObj = new RegRequest(regRequest);

		// Save the Reg request
		regRequestObj.save(function() {
			// Request Reg requests
			request(app).get('/reg-requests')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Reg request if not signed in', function(done) {
		// Create new Reg request model instance
		var regRequestObj = new RegRequest(regRequest);

		// Save the Reg request
		regRequestObj.save(function() {
			request(app).get('/reg-requests/' + regRequestObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', regRequest.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Reg request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Reg request
				agent.post('/reg-requests')
					.send(regRequest)
					.expect(200)
					.end(function(regRequestSaveErr, regRequestSaveRes) {
						// Handle Reg request save error
						if (regRequestSaveErr) done(regRequestSaveErr);

						// Delete existing Reg request
						agent.delete('/reg-requests/' + regRequestSaveRes.body._id)
							.send(regRequest)
							.expect(200)
							.end(function(regRequestDeleteErr, regRequestDeleteRes) {
								// Handle Reg request error error
								if (regRequestDeleteErr) done(regRequestDeleteErr);

								// Set assertions
								(regRequestDeleteRes.body._id).should.equal(regRequestSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Reg request instance if not signed in', function(done) {
		// Set Reg request user 
		regRequest.user = user;

		// Create new Reg request model instance
		var regRequestObj = new RegRequest(regRequest);

		// Save the Reg request
		regRequestObj.save(function() {
			// Try deleting Reg request
			request(app).delete('/reg-requests/' + regRequestObj._id)
			.expect(401)
			.end(function(regRequestDeleteErr, regRequestDeleteRes) {
				// Set message assertion
				(regRequestDeleteRes.body.message).should.match('User is not logged in');

				// Handle Reg request error error
				done(regRequestDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		RegRequest.remove().exec();
		done();
	});
});