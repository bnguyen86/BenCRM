'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$mdSidenav',
	function($scope, Authentication, Menus, $mdSidenav) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleLeft = function() {
		    $mdSidenav('left').toggle()
		        .then(function() {
		            //$log.debug("toggle left is done");
       		});
		};

		$scope.close = function() {
			$mdSidenav('left').close()
				.then(function(){
				//$log.debug("close LEFT is done");
				});
		};


		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

angular.module('core').controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
	
});