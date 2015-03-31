'use strict';

angular.module('contacts-modal').controller('ContactsModalController', ['$scope', '$modalInstance','contactList','$filter',
	function($scope, $modalInstance, contactList, $filter) {
		$scope.contacts = contactList;

		$scope.ok = function () {
			$modalInstance.close($scope.selected);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
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