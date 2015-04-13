'use strict';

// Jobs controller
angular.module('jobs').controller('JobsController', ['$scope', '$stateParams', '$location', '$mdDialog', 'Authentication', 'Jobs', 'Accounts', 'Socket',
	function($scope, $stateParams, $location, $mdDialog, Authentication, Jobs, Accounts, Socket) {
		$scope.authentication = Authentication;
		$scope.statusOptions = ['Open', 'Completed', 'Assigned', 'Cancelled'];
		$scope.job = {
			account : {
				name : null,
				_id : null
			},
			contacts : []
		};

		// Create new job
		$scope.create = function() {
			// Create new job object
			var contactsList = [];
			if($scope.job.contacts && $scope.job.contacts.length > 0){				
				for(var i = 0 ; i < $scope.job.contacts.length ; i++){
					contactsList.push($scope.job.contacts[i]._id);
				}
			}

			var job = new Jobs ({
				name: this.name,
				number: this.number,
				line_items: $scope.items,
				contacts: contactsList,
				account: $scope.job.account._id
			});

			// Redirect after save
			job.$save(function(response) {
				$location.path('jobs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing job
		$scope.remove = function(job) {
			if ( job ) { 
				job.$remove();

				for (var i in $scope.Jobs) {
					if ($scope.Jobs [i] === job) {
						$scope.Jobs.splice(i, 1);
					}
				}
			} else {
				$scope.job.$remove(function() {
					$location.path('jobs');
				});
			}
		};

		// Update existing job
		$scope.update = function() {
			var job = $scope.job;

			job.$update(function() {
				$location.path('jobs/' + job._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Jobs
		$scope.find = function() {
			$scope.jobs = Jobs.query();
		};

		// Find existing job
		$scope.findOne = function() {
			$scope.job = Jobs.get({ 
				jobId: $stateParams.jobId
			}, function(){
				if($scope.job.account){
					$scope.job.account = Accounts.get({
					accountId: $scope.job.account._id
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
		    		if($scope.job.account._id !== account._id){
		    			$scope.job.contacts = [];
		    		}
		            $scope.job.account = Accounts.get({ 
						accountId: account._id
					});
		        },
		        function() {
		            console.log('Modal dismissed at: ' + new Date());
		        });
		};

		//Open contacts modal
		$scope.openContacts = function(event){
			if(!$scope.job.account){
				console.log('No account chosen');
				return null;
			}

		    $mdDialog.show({
		    	targetEvent: event,
		        templateUrl: 'contactsModal.html',        
		        controller: 'ContactsModalController',
		        resolve: {
		        	contactList: function(){
		        		return $scope.job.account.contacts;		        		
		        	}
		        }
		        
		    })
		    .then(function(contacts) {
		            $scope.job.contacts = contacts;
		        },
		        function() {
		            console.log('Modal dismissed at: ' + new Date());
		        });
		};

		Socket.on('job.created', function(job) {
		    $scope.jobs.push(job);
		});
	}
]);