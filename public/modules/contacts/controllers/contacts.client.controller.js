'use strict';

// Contacts controller
angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contacts','Accounts','$modal',
	function($scope, $stateParams, $location, Authentication, Contacts, Accounts, $modal) {
		$scope.authentication = Authentication;

		// Create new Contact
		$scope.create = function() {
			// Create new Contact object
			var contact = new Contacts ({
				name: this.name,
				address: this.address,
				phone: this.phone,
				email: this.email,
				account: this.account
			});

			// Redirect after save
			contact.$save(function(response) {
				$location.path('contacts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contact
		$scope.remove = function(contact) {
			if ( contact ) { 
				contact.$remove();

				for (var i in $scope.contacts) {
					if ($scope.contacts [i] === contact) {
						$scope.contacts.splice(i, 1);
					}
				}
			} else {
				$scope.contact.$remove(function() {
					$location.path('contacts');
				});
			}
		};

		// Update existing Contact
		$scope.update = function() {
			var contact = $scope.contact;

			contact.$update(function() {
				$location.path('contacts/' + contact._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contacts
		$scope.find = function() {
			$scope.contacts = Contacts.query();
		};

		// Find existing Contact
		$scope.findOne = function() {
			$scope.contact = Contacts.get({ 
				contactId: $stateParams.contactId
			});
		};

		//Open moddal
		$scope.open = function(){
		    var modalInstance = $modal.open({
		        templateUrl: 'accountsModal.html',        
		        controller: 'ContactsModalController'
		        
		    });
		};

		// Get list of accounts to asscociate with the contact
		$scope.findAccounts = function(){
			$scope.accounts = Accounts.query();
		};
	}
]);

angular.module('contacts').controller('ContactsModalController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contacts','Accounts','$modal',
	function($scope, $stateParams, $location, Authentication, Contacts, Accounts, $modal) {

	}]);