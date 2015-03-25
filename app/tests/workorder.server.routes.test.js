'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Workorder = mongoose.model('Workorder'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, workorder;

/**
 * Workorder routes tests
 */
describe('Workorder CRUD tests', function() {
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

		// Save a user to the test db and create new Workorder
		user.save(function() {
			workorder = {
				name: 'Workorder Name'
			};

			done();
		});
	});

	it('should be able to save Workorder instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workorder
				agent.post('/workorders')
					.send(workorder)
					.expect(200)
					.end(function(workorderSaveErr, workorderSaveRes) {
						// Handle Workorder save error
						if (workorderSaveErr) done(workorderSaveErr);

						// Get a list of Workorders
						agent.get('/workorders')
							.end(function(workordersGetErr, workordersGetRes) {
								// Handle Workorder save error
								if (workordersGetErr) done(workordersGetErr);

								// Get Workorders list
								var workorders = workordersGetRes.body;

								// Set assertions
								(workorders[0].user._id).should.equal(userId);
								(workorders[0].name).should.match('Workorder Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Workorder instance if not logged in', function(done) {
		agent.post('/workorders')
			.send(workorder)
			.expect(401)
			.end(function(workorderSaveErr, workorderSaveRes) {
				// Call the assertion callback
				done(workorderSaveErr);
			});
	});

	it('should not be able to save Workorder instance if no name is provided', function(done) {
		// Invalidate name field
		workorder.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workorder
				agent.post('/workorders')
					.send(workorder)
					.expect(400)
					.end(function(workorderSaveErr, workorderSaveRes) {
						// Set message assertion
						(workorderSaveRes.body.message).should.match('Please fill Workorder name');
						
						// Handle Workorder save error
						done(workorderSaveErr);
					});
			});
	});

	it('should be able to update Workorder instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workorder
				agent.post('/workorders')
					.send(workorder)
					.expect(200)
					.end(function(workorderSaveErr, workorderSaveRes) {
						// Handle Workorder save error
						if (workorderSaveErr) done(workorderSaveErr);

						// Update Workorder name
						workorder.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Workorder
						agent.put('/workorders/' + workorderSaveRes.body._id)
							.send(workorder)
							.expect(200)
							.end(function(workorderUpdateErr, workorderUpdateRes) {
								// Handle Workorder update error
								if (workorderUpdateErr) done(workorderUpdateErr);

								// Set assertions
								(workorderUpdateRes.body._id).should.equal(workorderSaveRes.body._id);
								(workorderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Workorders if not signed in', function(done) {
		// Create new Workorder model instance
		var workorderObj = new Workorder(workorder);

		// Save the Workorder
		workorderObj.save(function() {
			// Request Workorders
			request(app).get('/workorders')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Workorder if not signed in', function(done) {
		// Create new Workorder model instance
		var workorderObj = new Workorder(workorder);

		// Save the Workorder
		workorderObj.save(function() {
			request(app).get('/workorders/' + workorderObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', workorder.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Workorder instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Workorder
				agent.post('/workorders')
					.send(workorder)
					.expect(200)
					.end(function(workorderSaveErr, workorderSaveRes) {
						// Handle Workorder save error
						if (workorderSaveErr) done(workorderSaveErr);

						// Delete existing Workorder
						agent.delete('/workorders/' + workorderSaveRes.body._id)
							.send(workorder)
							.expect(200)
							.end(function(workorderDeleteErr, workorderDeleteRes) {
								// Handle Workorder error error
								if (workorderDeleteErr) done(workorderDeleteErr);

								// Set assertions
								(workorderDeleteRes.body._id).should.equal(workorderSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Workorder instance if not signed in', function(done) {
		// Set Workorder user 
		workorder.user = user;

		// Create new Workorder model instance
		var workorderObj = new Workorder(workorder);

		// Save the Workorder
		workorderObj.save(function() {
			// Try deleting Workorder
			request(app).delete('/workorders/' + workorderObj._id)
			.expect(401)
			.end(function(workorderDeleteErr, workorderDeleteRes) {
				// Set message assertion
				(workorderDeleteRes.body.message).should.match('User is not logged in');

				// Handle Workorder error error
				done(workorderDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Workorder.remove().exec();
		done();
	});
});