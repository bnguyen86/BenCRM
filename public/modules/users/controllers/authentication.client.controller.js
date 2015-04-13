'use strict';
/* global _: false */
angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'RegRequests',
	function($scope, $http, $location, Authentication, RegRequests) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			if($scope.credentials.password !== $scope.password){
				$scope.error = 'Passwords do not match';
				return null;
			}

			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				
				//If the user entered an email for the admin, then send a request
				if($scope.adminEmail){
					var regRequest = new RegRequests ({
						email : $scope.adminEmail
					});

					regRequest.$save(function(response) {
						//DO SOMETHING
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}

				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				//TODO: if creating a new company, then redirect to create company page
				//If not, then ask user for the admin email
				if(_.includes($scope.authentication.user.roles, 'admin')){
					$location.path('companies/create');
				} else {
					$location.path('/');
				}
			}).error(function(response) {
				$scope.error = response.message;
			});

		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);