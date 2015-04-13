'use strict';

// Workorders controller
angular.module('workorders').controller('WorkordersController', ['$scope', '$stateParams', '$location', '$mdDialog', 'Authentication', 'Workorders', 'Accounts',
	function($scope, $stateParams, $location, $mdDialog, Authentication, Workorders, Accounts) {
		$scope.authentication = Authentication;
		$scope.workorder = {
			account : {
				name : null,
				_id : null
			},
			contacts : []
		};



		// Create new Workorder
		$scope.create = function() {
			// Create new Workorder object
			var contactsList = [];
			if($scope.workorder.contacts && $scope.workorder.contacts.length > 0){				
				for(var i = 0 ; i < $scope.workorder.contacts.length ; i++){
					contactsList.push($scope.workorder.contacts[i]._id);
				}
			}

			var workorder = new Workorders ({
				name: this.name,
				number: this.number,
				line_items: $scope.items,
				contacts: contactsList,
				account: $scope.workorder.account._id
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
			}, function(){
				if($scope.workorder.account){
					$scope.workorder.account = Accounts.get({
					accountId: $scope.workorder.account._id
				});
			}
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
			if(itemArray){
				for(var i = 0 ; i < itemArray.length ; i++){
					total += itemArray[i].qty * itemArray[i].price_per_unit;
				}
			}

			return total;
		};

		//Open Account modal
		$scope.openAccounts = function(event){
		    $mdDialog.show({
		    	targetEvent: event,
		        templateUrl: 'accountsModal.html',        
		        controller: 'AccountModalController',
		        clickOutsideToClose: true,
		        resolve: {
		        	accounts: function(){
		        		return Accounts.query();
		        	}
		        }
		        
		    })
		    .then(function(account) {
		    		if($scope.workorder.account._id !== account._id){
		    			$scope.workorder.contacts = [];
		    		}
		            $scope.workorder.account = Accounts.get({ 
						accountId: account._id
					});
		        },
		        function() {
		            console.log('Modal dismissed at: ' + new Date());
		        });
		};

		//Open contacts modal
		$scope.openContacts = function(event){
			if(!$scope.workorder.account){
				console.log('No account chosen');
				return null;
			}

		    $mdDialog.show({
		    	targetEvent: event,
		        templateUrl: 'contactsModal.html',        
		        controller: 'ContactsModalController',
		        resolve: {
		        	contactList: function(){
		        		return $scope.workorder.account.contacts;		        		
		        	}
		        }
		        
		    })
		    .then(function(contacts) {
		            $scope.workorder.contacts = contacts;
		        },
		        function() {
		            console.log('Modal dismissed at: ' + new Date());
		        });
		};
	}
]);