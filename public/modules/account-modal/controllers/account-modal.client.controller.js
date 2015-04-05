'use strict';

angular.module('account-modal').controller('AccountModalController', ['$scope', '$mdDialog','accounts',
	function($scope, $mdDialog, accounts) {
		$scope.accounts = accounts;
		$scope.selected = {account:null};

		$scope.ok = function () {
			$mdDialog.hide($scope.selected.account);
		};

		$scope.cancel = function () {
			$mdDialog.cancel();
		};
	}
]);