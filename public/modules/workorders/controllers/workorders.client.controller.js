'use strict';

// Workorders controller
angular.module('workorders').controller('WorkordersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workorders', 'Accounts', '$modal',
	function($scope, $stateParams, $location, Authentication, Workorders, Accounts, $modal) {
		$scope.authentication = Authentication;

		// Create new Workorder
		$scope.create = function() {
			// Create new Workorder object
			var contactsList = [];
			if($scope.contacts !== (null && undefined)){				
				for(var i = 0 ; i < $scope.contacts.length ; i++){
					contactsList.push($scope.contacts[i]._id);
				}
			}

			var workorder = new Workorders ({
				name: this.name,
				number: this.number,
				line_items: $scope.items,
				contacts: contactsList,
				account: this.account._id
			});

			// Redirect after save
			workorder.$save(function(response) {
				$location.path('workorders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Workorder
		$scope.remove = function(workorder) {
			if ( workorder ) { 
				workorder.$remove();

				for (var i in $scope.workorders) {
					if ($scope.workorders [i] === workorder) {
						$scope.workorders.splice(i, 1);
					}
				}
			} else {
				$scope.workorder.$remove(function() {
					$location.path('workorders');
				});
			}
		};

		// Update existing Workorder
		$scope.update = function() {
			var workorder = $scope.workorder;

			workorder.$update(function() {
				$location.path('workorders/' + workorder._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workorders
		$scope.find = function() {
			$scope.workorders = Workorders.query();
		};

		// Find existing Workorder
		$scope.findOne = function() {
			$scope.workorder = Workorders.get({ 
				workorderId: $stateParams.workorderId
			});
		};

		//Add line item
		$scope.items = [];
		$scope.addItem = function(item) {
			var newItem = {
					uom: item.uom,
					description: item.description,
					qty: item.qty,
					price_per_unit: item.price_per_unit
				};
			$scope.items.push(newItem);
			this.item = null;
			$scope.itemTotal = $scope.findTotal($scope.items);
		};

		$scope.deleteItem = function(item) {
			for(var i = 0 ; i < $scope.items.length ; i++){
				if($scope.items[i] === item){
					$scope.items.splice(i,1);
				}
			}
			$scope.itemTotal = $scope.findTotal($scope.items);
		};

		$scope.findTotal = function(itemArray){
			var total = 0;
			if(itemArray !== (null && undefined)){
				for(var i = 0 ; i < itemArray.length ; i++){
					total += itemArray[i].qty * itemArray[i].price_per_unit;
				}
			}

			return total;
		};

		//Open Account modal
		$scope.openAccounts = function(){
		    var modalInstance = $modal.open({
		        templateUrl: 'accountsModal.html',        
		        controller: 'AccountModalController',
		        resolve: {
		        	accounts: function(){
		        		return Accounts.query();
		        	}
		        }
		        
		    });
		    modalInstance.result.then(function(account) {
		            $scope.account = Accounts.get({ 
											accountId: account._id
										});
		        },
		        function() {
		            console.log('Modal dismissed at: ' + new Date());
		        });
		};

		//Open contacts modal
		$scope.openContacts = function(){
			if($scope.account === null || $scope.account === undefined){
				console.log('No account chosen');
				return null;
			}

		    var modalInstance = $modal.open({
		        templateUrl: 'contactsModal.html',        
		        controller: 'ContactsModalController',
		        resolve: {
		        	contactList: function(){
		        		return $scope.account.contacts;
		        		
		        	}
		        }
		        
		    });
		    modalInstance.result.then(function(contacts) {
		            $scope.contacts = contacts;
		        },
		        function() {
		            console.log('Modal dismissed at: ' + new Date());
		        });
		};
	}
]);