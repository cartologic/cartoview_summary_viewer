/**
 * Created by kamal on 6/29/16.
 */
angular.module('cartoview.summaryViewerApp').directive('summaryViewer',  function(urlsHelper) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: urlsHelper.static + "cartoview_summary_viewer/angular-templates/summary.html",
        controller: function ($scope, summaryViewerService) {
            $scope.summary = summaryViewerService;
            $scope.collaped = false;
        }
    }
});
