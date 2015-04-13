'use strict';

// Reg requests controller
angular.module('reg-requests').controller('RegRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'RegRequests',
	function($scope, $stateParams, $location, Authentication, RegRequests) {
		$scope.authentication = Authentication;

		// Create new Reg request
		$scope.create = function() {
			// Create new Reg request object
			var regRequest = new RegRequests ({
				name: this.name
			});

			// Redirect after save
			regRequest.$save(function(response) {
				$location.path('reg-requests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Reg request
		$scope.remove = function(regRequest) {
			if ( regRequest ) { 
				regRequest.$remove();

				for (var i in $scope.regRequests) {
					if ($scope.regRequests [i] === regRequest) {
						$scope.regRequests.splice(i, 1);
					}
				}
			} else {
				$scope.regRequest.$remove(function() {
					$location.path('reg-requests');
				});
			}
		};

		// Update existing Reg request
		$scope.update = function() {
			var regRequest = $scope.regRequest;

			regRequest.$update(function() {
				$location.path('reg-requests/' + regRequest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reg requests
		$scope.find = function() {
			$scope.regRequests = RegRequests.query();
		};

		// Find existing Reg request
		$scope.findOne = function() {
			$scope.regRequest = RegRequests.get({ 
				regRequestId: $stateParams.regRequestId
			});
		};
	}
]);