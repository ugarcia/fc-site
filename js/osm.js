// OSM MAP handling script

/** ---------------------------------------------------------------------------------- **/
/** -------------------------------- LAYERS ----------------------------------- **/
/** ---------------------------------------------------------------------------------- **/

/* --------------------- Base Layers  (currently Bing or OSM) --------------------*/
function getBaseLayersFromSource(source) {
     if (source == "bing")
        return layersFromBing();
     else if (source == "osm")
        return layersFromOSM();
    return null;
}

/* --------------------- Bing Layers --------------------*/
function layersFromBing() {
    var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
    var layers = [
       new OpenLayers.Layer.Bing({
            key: apiKey,
            type: "Road",
            metadataParams: {mapVersion: "v1"},
            isBaseLayer: true
        }),
        new OpenLayers.Layer.Bing({
            key: apiKey,
            type: "Aerial",
            isBaseLayer: true
        }),
        new OpenLayers.Layer.Bing({
            key: apiKey,
            type: "AerialWithLabels",
            name: "Bing Aerial With Labels",
            isBaseLayer: true
        })
    ];
    return layers;
}

/* --------------------- OSM Layers --------------------*/
function layersFromOSM() {
    var layers = [
           new OpenLayers.Layer.OSM(
                "OpenCycleMap",
                [
                    "http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
                    "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
                    "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"
                ],
                {
                    layers: "basic",
                    isBaseLayer: true,
                    resolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
                                  19567.87923828125, 9783.939619140625, 4891.9698095703125,
                                  2445.9849047851562, 1222.9924523925781, 611.4962261962891,
                                  305.74811309814453, 152.87405654907226, 76.43702827453613,
                                  38.218514137268066, 19.109257068634033, 9.554628534317017,
                                  4.777314267158508, 2.388657133579254, 1.194328566789627,
                                  0.5971642833948135, 0.25, 0.1, 0.05],
                    serverResolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
                                        19567.87923828125, 9783.939619140625,
                                        4891.9698095703125, 2445.9849047851562,
                                        1222.9924523925781, 611.4962261962891,
                                        305.74811309814453, 152.87405654907226,
                                        76.43702827453613, 38.218514137268066,
                                        19.109257068634033, 9.554628534317017,
                                        4.777314267158508, 2.388657133579254,
                                        1.194328566789627, 0.5971642833948135],
                    transitionEffect: 'resize'
                }
            )
    ];
    return layers;
}

/* -------------------------- Custom Layers --------------------------*/
function getCustomLayers() {
    // allow testing of specific renderers via "?renderer=Canvas", etc
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
    var layers = [
        new OpenLayers.Layer.Vector("Points"),
        new OpenLayers.Layer.Vector("Draws", {
                    renderers: renderer
                }),
        new OpenLayers.Layer.Vector("Geo")
    ];
    return layers;
}


/** ---------------------------------------------------------------------------------- **/
/** ---------------------------- CONTROLS ----------------------------------- **/
/** ---------------------------------------------------------------------------------- **/

/** --------------------- Geolocation Control --------------------- **/
function getGeolocationControl(ref, callback) {
    var matchingLayers = ref.map.getLayersByName("Geo");
    var geoLocationLayer =  matchingLayers[0];

    var geolocate = new OpenLayers.Control.Geolocate({
        bind: true,
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });

    geolocate.events.register("locationupdated",geolocate,function(e) {

        geoLocationLayer.removeAllFeatures();

        callback.call(e.point);

        var circle = new OpenLayers.Feature.Vector(
            OpenLayers.Geometry.Polygon.createRegularPolygon(
                new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                e.position.coords.accuracy/2,
                40,
                0
            ),
            {},
            {
                fillColor: '#000',
                fillOpacity: 0.1,
                strokeWidth: 0
            }
        );
        var cross = new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
        );
        geoLocationLayer.addFeatures( [ cross, circle ] );

        if (ref.followGeoLocation) {
            ref.map.zoomToExtent(geoLocationLayer.getDataExtent());
            ref.map.zoomOut();
            ref.map.zoomOut();
            pulsate(circle, geoLocationLayer);
            this.bind = true;
            ref.followGeoLocation = false;
        }
    });

    geolocate.events.register("locationfailed",this,function() {
        OpenLayers.Console.log('Location detection failed');
    });
    
    return geolocate;
}

/** --------------------- Toolbar --------------------- **/
function getCustomToolBar(ref) {
    var matchingLayers = ref.map.getLayersByName("Draws");

    var toolBarControls =  [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.MousePosition(),
        new OpenLayers.Control.DragFeature(matchingLayers[0]),
        new OpenLayers.Control.DrawFeature(
            matchingLayers[0],
            OpenLayers.Handler.Path,
            { 'displayClass': 'olControlDrawFeaturePath'}
         ),
        new OpenLayers.Control.DrawFeature(
            matchingLayers[0],
            OpenLayers.Handler.Polygon,
            { 
                'displayClass': 'olControlDrawFeaturePolygon',
                featureAdded: function(feature) { addLocalFeature(feature, ref); },
                handlerOptions: { holeModifier: "altKey" }
            }
         ),
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.PanZoomBar()
    ];

    var toolbar = new OpenLayers.Control.Panel({
       displayClass: 'olControlEditingToolbar',
       defaultControl: toolBarControls[0]
    });
    toolbar.addControls(toolBarControls);
    return toolbar;
}

function getHistoryControl(ref) {
     var nav = new OpenLayers.Control.NavigationHistory({
        previousOptions: {
            title: "Go to previous map position",
            text: "Prev"
        },
        nextOptions: {
            title: "Go to next map position",
            text: "Next"
        },
        displayClass: "navHistory"
    });
    ref.map.addControl(nav);

    var panel = new OpenLayers.Control.Panel();
    panel.addControls( [ nav.previous, nav.next ] );
    return panel;
}

function setFeatureSelectControl(ref) {
    var featuresLayers = ref.map.getLayersByName("Draws");
    var select = new OpenLayers.Control.SelectFeature(
        featuresLayers[0], 
        { 
            multiple: true,
            clickout: true,
            box: true,
            onSelect: function(feature) { selectedFeatureHandler(feature, ref); }
        }
    );
    ref.map.addControl(select);
    select.activate();
}

function setFeatureModifyControl(ref) {
    var featuresLayers = ref.map.getLayersByName("Draws");
    var modify = new OpenLayers.Control.ModifyFeature(featuresLayers[0]);
    ref.map.addControl(modify);
    //modify.activate();
}

function getCustomControls(ref) {
    ref.geoLocationControl =  getGeolocationControl(
        ref,
        function()  {
            $('#geoLocationLabelX').text(this.x);
            $('#geoLocationLabelY').text(this.y);
        }
    );

    setFeatureSelectControl(ref);
    setFeatureModifyControl(ref);

    var controls = [
        getHistoryControl(ref),
        getCustomToolBar(ref),
        new OpenLayers.Control.LayerSwitcher(),
        ref.geoLocationControl
    ];
    return controls;
}


/** ---------------------------------------------------------------------------------- **/
/** --------------------------- OLMap Class ---------------------------------- **/
/** ---------------------------------------------------------------------------------- **/
var OLMap = function(mapContainer, source) {
    this.container = mapContainer || 'map';
    this.src = source || 'osm';
    this.geoLocationControl = null;
    this.followGeoLocation = true;
    this.features = [];
    this.currPopup = null;
    this.map = new OpenLayers.Map(
        this.container,
        {
            theme: null,
            projection: "EPSG:900913",
            fractionalZoom: true
         }
     );
    this.reloadBaseMap();
};
OLMap.prototype = {
    reloadBaseMap: function() {  
         var layersToRemove = [];
         for (var key in this.map.layers)
            if (this.map.layers[key].isBaseLayer)
                layersToRemove.push(this.map.layers[key]);
         for (var key in layersToRemove)
                this.map.removeLayer(layersToRemove[key], false);
         this.map.addLayers(getBaseLayersFromSource(this.src));

    },
    changeSource: function(source) {
         this.src = source;
         this.reloadBaseMap();
    }
};


/** ---------------------------------------------------------------------------------- **/
/** ----------------------- CUSTOM FUNCTIONS------------------------- **/
/** ---------------------------------------------------------------------------------- **/

function returnKeyByValue(list, value) {
    for (var key in list)
        if (list[key] == value)
            return key;
    return null; 
}

function deleteFeature(id) {
    alert(olMap.features[id]); // de-acople this!!!
}

function selectedFeatureHandler(feature, ref) {
    var featurePoint = feature.geometry.getCentroid();
    var featureId = returnKeyByValue(ref.features, feature);
    var popup = new OpenLayers.Popup(
                            "popupid",
                             new OpenLayers.LonLat(featurePoint.x, featurePoint.y),
                             new OpenLayers.Size(100,200),
                            "<a href='Javascript: deleteFeature(\"" + featureId + "\")'>Delete</a>",
                            true);
    if (ref.currPopup)
        ref.map.removePopup(ref.currPopup);
    ref.currPopup = popup;
    ref.map.addPopup(popup);
}

/** -------------------------- Adding a Feature to Local Storage (JSON) ------------------------- **/
function addLocalFeature(feature, ref) {
    var json = new OpenLayers.Format.GeoJSON(
        {
            'internalProjection': ref.map.baseLayer.projection,
            'externalProjection': new OpenLayers.Projection("EPSG:4326")
        }
    );
    // second argument for pretty printing (geojson only)
    var str = json.write(feature, false);
    alert(str);
    var featuresIndex = JSON.parse(window.localStorage.getItem('featuresIndex')) || []; // Improve this, load into a global on startup
    alert(featuresIndex);
    var newFeatureName = 'feature_' + featuresIndex.length;
    window.localStorage.setItem(newFeatureName, str);
    featuresIndex.push(newFeatureName);
    window.localStorage.setItem('featuresIndex', JSON.stringify(featuresIndex));
}

/** -------------------------- Adding a Feature to Local Storage (JSON) ------------------------- **/
function loadLocalFeatures(ref) {
     var featuresIndex = JSON.parse(window.localStorage.getItem('featuresIndex')) || [];

    if (featuresIndex.length == 0)
        return;

    var json = new OpenLayers.Format.GeoJSON(
        {
            'internalProjection': ref.map.baseLayer.projection,
            'externalProjection': new OpenLayers.Projection("EPSG:4326")
        }
    );
    ref.features = [];
    var featuresLayers =ref.map.getLayersByName("Draws");
    for (var key in featuresIndex) {
        var feature = json.read(window.localStorage.getItem(featuresIndex[key]));
        ref.features[featuresIndex[key]] = feature;
        featuresLayers[0].addFeatures(feature); 
    }
}
/** -------------------------- Pulsing  layer ------------------------- **/
var pulsate = function(feature, layer) {
    var point = feature.geometry.getCentroid(),
        bounds = feature.geometry.getBounds(),
        radius = Math.abs((bounds.right - bounds.left)/2),
        count = 0,
        grow = 'up';

    var resize = function(){
        if (count>16) {
            clearInterval(window.resizeInterval);
        }
        var interval = radius * 0.03;
        var ratio = interval/radius;
        switch(count) {
            case 4:
            case 12:
                grow = 'down'; break;
            case 8:
                grow = 'up'; break;
        }
        if (grow!=='up') {
            ratio = - Math.abs(ratio);
        }
        feature.geometry.resize(1+ratio, point);
        layer.drawFeature(feature);
        count++;
    };
    window.resizeInterval = window.setInterval(resize, 50, point, radius);
};

/** --------------------- Adding Markers --------------------- **/
function addPointToLayer(layer) {
    var feature = new OpenLayers.Feature.Vector(
        new OpenLayers.Geometry.Point(
                $('#osmGetPointX').val(), 
                $('#osmGetPointY').val()
            ),
        { some:'data' },
        {
           externalGraphic: 'img/ol/marker-blue.png', 
           graphicHeight: 25, 
           graphicWidth: 21
        }
    );
    layer.addFeatures(feature);
}

/** -------------------- Zoom map to world center --------------------- **/
function zoomToWorldCenter(ref) {
    var maxRes = parseFloat(ref.map.getMaxResolution());
    var extent = [-50 * maxRes, -50 * maxRes, 50 * maxRes, 50 * maxRes];
    ref.map.zoomToExtent( extent );
}

/** -------------------- Force GeoLocation --------------------- **/
function geoLocateNow(ref) {
    ref.geoLocationControl.deactivate();
    ref.followGeoLocation = true;
    ref.geoLocationControl.watch = false;
    ref.geoLocationControl.activate();
}

/** --------------------- Init Map --------------------- **/
function initMap(ref) {
    ref.map.addLayers(getCustomLayers());
    ref.map.addControls(getCustomControls(ref));
    zoomToWorldCenter(ref);
    setInterval(function() { geoLocateNow(ref); } , 60000);
    loadLocalFeatures(ref);
    
}

/** ---------------------------------------------------------------------------------- **/
/** ----------------------------------- MAIN -------------------------------------- **/
/** ---------------------------------------------------------------------------------- **/

/** --------------------- Map declaration --------------------- **/
var olMap = new OLMap("map");
initMap(olMap);

$('#mapSource').change(function() {
    olMap.changeSource($('#mapSource').val());
});

var matchingLayers = olMap.map.getLayersByName("Points");
var pointsLayer = matchingLayers[0];
$('#osmGetPointButton').click(function() {
    addPointToLayer(pointsLayer);
});

$("div.olControlZoom").remove();
