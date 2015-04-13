'use strict';

//Reg requests service used to communicate Reg requests REST endpoints
angular.module('reg-requests').factory('RegRequests', ['$resource',
	function($resource) {
		return $resource('reg-requests/:regRequestId', { regRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);