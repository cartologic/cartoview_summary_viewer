/**
 * Created by kamal on 7/3/16.
 */
angular.module('cartoview.summaryViewerApp').service('summaryViewerService', function(mapService, urlsHelper, $http, appConfig, $rootScope) {
    var service = this;
    service.appConfig = appConfig;
    service.items = appConfig.summaryViewer.items;
    var map = mapService.map;
    service.loading = 0;


    var getWMSLayer = function (name) {
        var wmsLayer = null;
        angular.forEach(mapService.map.overlays, function (layer) {
            if (layer.getLayers) {
                wmsLayer = getWMSLayer(name, layer.getLayers());
            } else {
                var layerSource = layer.get('source');
                if (layerSource && layerSource.getParams) {
                    var params = layerSource.getParams();
                    if (params && params.LAYERS == name) {
                        wmsLayer = layer;
                    }
                }
            }
            if (wmsLayer) {
                return false
            }
        });
        return wmsLayer;
    };
    var olMap;
    mapService.get().then(function () {
        olMap = mapService.map.olMap;
        olMap.on('moveend', function(event) {
            service.refresh();
        });
        service.refresh();
    });
    service.refresh = function () {
        var summarizedData = {};
        angular.forEach(appConfig.summaryViewer.items, function (item) {
            if(summarizedData[item.layer] == undefined) {
                summarizedData[item.layer] = {};
            }
            if(summarizedData[item.layer][item.attribute] == undefined) {
                summarizedData[item.layer][item.attribute] = {
                    sum: NaN,
                    count: 0,
                    min: NaN,
                    max: NaN
                };
                Object.defineProperty(summarizedData[item.layer][item.attribute], 'avg', {
                    get: function () {
                        if(this.sum == NaN) return NaN;
                        return Math.round((this.sum / this.count) *100) / 100;
                    }
                });
            }
            // if(summarizedData[item.layer][item.attribute][item.operation] == undefined) {
            //     summarizedData[item.layer][item.attribute][item.operation] = 0;
            // }
        });

        var view = olMap.getView();
        var extent = view.calculateExtent(olMap.getSize());
        var projection = view.getProjection();

        angular.forEach(summarizedData, function (layerSummary, layerName) {
            layerSummary.loading = true;
            var wmsLayer = getWMSLayer(layerName);
            var url = wmsLayer.get('source').getUrls()[0];
            var params = {
                service: 'WFS',
                version: '2.0.0',
                request: 'GetFeature',
                typename: layerName,
                outputFormat: 'application/json',
                srsname: projection.getCode(), //'EPSG:3857',
                bbox: extent.join(',') + ',' + projection.getCode()
            };
            url = urlsHelper.cartoviewGeoserverProxy + "wfs";

            $http.get(url, {
                params: params
            }).success(function (data) {
                angular.forEach(data.features, function (f, index, features) {
                    angular.forEach(layerSummary, function (attrSummary, attrName) {
                        attrSummary.count = index;
                        if(angular.isNumber(f.properties[attrName])) {
                            attrSummary.sum = attrSummary.sum == NaN ? f.properties[attrName] : f.properties[attrName] + attrSummary.sum ;
                            attrSummary.min = attrSummary.min == NaN ? f.properties[attrName] : Math.min(f.properties[attrName], attrSummary.min);
                            attrSummary.max = attrSummary.max == NaN ? f.properties[attrName] : Math.max(f.properties[attrName], attrSummary.min);
                        }
                    });
                });
                layerSummary.loading = false;
            });

        });
        service.summarizedData = summarizedData;
    }
});