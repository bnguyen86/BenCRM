'use strict';

// Workorders controller
angular.module('workorders').controller('WorkordersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workorders', 'Accounts', '$modal',
	function($scope, $stateParams, $location, Authentication, Workorders, Accounts, $modal) {
		$scope.authentication = Authentication;

		// Create new Workorder
		$scope.create = function() {
			// Create new Workorder object
			var workorder = new Workorders ({
				name: this.name
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
			this.itemTotal = $scope.findTotal($scope.items);
		};

		$scope.deleteItem = function(item) {
			for(var i = 0 ; i < $scope.items.length ; i++){
				if($scope.items[i] === item){
					$scope.items.splice(i,1);
				}
			}

			this.itemTotal = $scope.findTotal($scope.items);
		};

		$scope.findTotal = function(itemArray){
			return 999;
		};

		//Open Account modal
		$scope.open = function(){
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
		            $scope.account = account;
		        },
		        function() {
		            console.log('Modal dismissed at: ' + new Date());
		        });
		};
	}
]);