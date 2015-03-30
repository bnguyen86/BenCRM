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
				account: this.account._id
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
			contact.account = this.account._id;

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
			}, function(){
				$scope.account = $scope.contact.account;
			});			
		};

		//Open modal
		$scope.open = function(){
		    var modalInstance = $modal.open({
		        templateUrl: 'accountsModal.html',        
		        controller: 'ContactsModalController',
		        resolve: {
		        	accounts: function(){
		        		return Accounts.query();
		        	}
		        }
		        
		    });
		    modalInstance.result.then(function(account) {
		            $scope.account = account;
		        },
		        function() {
		            console.log('Modal dismissed at: ' + new Date());
		        });
		};
	}
]);

angular.module('contacts').controller('ContactsModalController', ['$scope', '$modalInstance','accounts', function($scope, $modalInstance, accounts) {
	$scope.accounts = accounts;
	$scope.selected = {account:null};

	$scope.ok = function () {
		$modalInstance.close($scope.selected.account);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);