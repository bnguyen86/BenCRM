'use strict';

angular.module('contacts-modal').controller('ContactsModalController', ['$scope', '$mdDialog','contactList','$filter',
	function($scope, $mdDialog, contactList, $filter) {
		$scope.contacts = contactList;

		$scope.ok = function () {
			$mdDialog.hide($scope.selected);
		};

		$scope.cancel = function () {
			$mdDialog.cancel();
		};

		$scope.updateContactList = function () {
			var ContactListObj = $filter('filter')($scope.contacts, {checked: true});
			$scope.selected = [];
			for(var i = 0 ; i < ContactListObj.length ; i++){
				$scope.selected.push(ContactListObj[i]);
			}
		};
	}
]);