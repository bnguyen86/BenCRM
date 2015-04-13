'use strict';

//Setting up route
angular.module('reg-requests').config(['$stateProvider',
	function($stateProvider) {
		// Reg requests state routing
		$stateProvider.
		state('listRegRequests', {
			url: '/reg-requests',
			templateUrl: 'modules/reg-requests/views/list-reg-requests.client.view.html'
		}).
		state('createRegRequest', {
			url: '/reg-requests/create',
			templateUrl: 'modules/reg-requests/views/create-reg-request.client.view.html'
		}).
		state('viewRegRequest', {
			url: '/reg-requests/:regRequestId',
			templateUrl: 'modules/reg-requests/views/view-reg-request.client.view.html'
		}).
		state('editRegRequest', {
			url: '/reg-requests/:regRequestId/edit',
			templateUrl: 'modules/reg-requests/views/edit-reg-request.client.view.html'
		});
	}
]);