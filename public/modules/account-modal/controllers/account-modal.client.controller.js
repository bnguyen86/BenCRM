'use strict';

angular.module('account-modal').controller('AccountModalController', ['$scope', '$modalInstance','accounts',
	function($scope, $modalInstance, accounts) {
		$scope.accounts = accounts;
		$scope.selected = {account:null};

		$scope.ok = function () {
			$modalInstance.close($scope.selected.account);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
]);