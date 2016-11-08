/**
 * @preserve
 * Copyright 2016 A Milevski <info@w8r.name>
 * Copyright 2014 JD Fergason
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 // UMD
 (function(factory) {
   var L;
   if (typeof define === 'function' && define.amd) {
     // AMD
     define(['leaflet'], factory);
   } else if (typeof module !== 'undefined') {
     // Node/CommonJS
     L = global.L || require('leaflet');
     module.exports = factory(L);
   } else {
     // Browser globals
     if (typeof window.L === 'undefined') {
       throw new Error('Leaflet must be loaded first');
     }
     factory(window.L);
   }
 })(function(L) {

var DEG_TO_RAD = Math.PI / 180;


/**
 * @class L.Ellipse
 * @extends L.Path
 */
L.Ellipse = L.Path.extend({

  options: {
    fill:       true,
    startAngle: 0,
    endAngle:   360
  },


  /**
   * @constructs
   * @param  {L.LatLng} latlng
   * @param  {Object}   options
   * @param  {Array.<Number>|L.Point} options.radius Radiuses
   * @param  {Number} options.tilt Tilt angle (deg)
   * @param  {Number} options.startAngle Start angle (deg)
   * @param  {Number} options.endAngle   End angle (deg)
   */
  initialize: function (latlng, options) {
    L.Util.setOptions(this, options);
    this.setLatLng(latlng);

    this._tilt = this.options.tilt || 0;

    if (this.options.endAngle === 360) {
      this.options.endAngle -= 1e-5;
    }

    this.setRadius(options.radius);
    //this._bounds = this.getBounds();
  },


  /**
   * @param {L.LatLng} latlng
   * @return {L.Ellipse}
   */
  setLatLng: function (latlng) {
    this._latlng = L.latLng(latlng);
    return this.redraw();
  },


  /**
   * @return {L.LatLng}
   */
  getLatLng: function () {
    return this._latlng;
  },


  /**
   * @param {Array.<Number>|L.Point} radii
   */
  setRadius: function (radii) {
    radii = L.point(radii);
    this._mRadiusX = radii.x;
    this._mRadiusY = radii.y;
    return this.redraw();
  },


  /**
   * @return {L.Point}
   */
  getRadius: function () {
    return new L.Point(this._mRadiusX, this._mRadiusY);
  },


  /**
   * @param {Number} tilt
   */
  setTilt: function (tilt) {
    this._tilt = tilt;
    return this.redraw();
  },


  _updateBounds: function () {
    var map      = this._map;
    var w        = this._clickTolerance();
    var padding  = new L.Point(w, -w);
    this._bounds = this._bounds || this.getBounds();
    var bounds   = this._bounds;

    if (bounds.isValid()) {
      this._pxBounds = new L.Bounds(
        map.latLngToLayerPoint(bounds.getSouthWest())._subtract(padding),
        map.latLngToLayerPoint(bounds.getNorthEast())._add(padding));
    }
  },


  _project: function () {
    this._point = this._map.latLngToLayerPoint(this._latlng);
    this._projectLatlngs();
    this._updateBounds();
  },


  _projectLatlngs: function () {
    var map    = this._map;
    var crs    = map.options.crs;
    var latlng = this._latlng;

    this._point    = map.latLngToLayerPoint(latlng);
    if (crs.distance === L.CRS.Earth.distance) {
      var lat        = latlng.lat, lng = latlng.lng;
      var latR       = (this._mRadiusY / L.CRS.Earth.R) / DEG_TO_RAD;
      var top        = map.project([lat + latR, lng]);
      var bottom     = map.project([lat - latR, lng]);
      var projCenter = top.add(bottom).divideBy(2);
      var lat2       = map.unproject(projCenter).lat;
      var lngR2      = (Math.acos((Math.cos(latR * DEG_TO_RAD) -
         Math.sin(lat * DEG_TO_RAD) * Math.sin(lat2 * DEG_TO_RAD)) /
        (Math.cos(lat * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD))) / DEG_TO_RAD)
        * this._mRadiusX / this._mRadiusY;

      this._radiusX = this._point.x - map.latLngToLayerPoint([lat, lng - lngR2]).x;
      this._radiusY = this._point.y - map.latLngToLayerPoint([lat + latR, lng]).y;
    } else {
      var latlng2 = crs.unproject(crs.project(this._latlng)
        .subtract([this._mRadiusX, -this._mRadiusY]));
      var topLeft = map.latLngToLayerPoint(latlng2);

			this._radiusX = this._point.x - topLeft.x;
      this._radiusY = this._point.y - topLeft.y;
    }
    this._endPointParams = this._centerPointToEndPoint();
  },


  /**
   * @return {L.LatLngBounds}
   */
  getBounds: function () {
  	var half = [this._radiusX, this._radiusY];

  	return new L.LatLngBounds(
  		this._map.layerPointToLatLng(this._point.subtract(half)),
  		this._map.layerPointToLatLng(this._point.add(half)));
  },


  /**
   * Following the L.Circle example
   */
  _update: function () {
    if (this._map) {
			this._updatePath();
		}
  },


  _updatePath: function () {
    this._renderer._updateEllipse(this);
  },


  /**
   * Convert between center point parameterization of an ellipse
   * too SVG's end-point and sweep parameters.  This is an
   * adaptation of the perl code found here:
   * http://commons.oreilly.com/wiki/index.php/SVG_Essentials/Paths
   */
  _centerPointToEndPoint: function () {
    var c      = this._point,
        rx     = this._radiusX,
        ry     = this._radiusY,
        opts   = this.options,
        theta2 = (opts.startAngle + opts.endAngle) * DEG_TO_RAD,
        theta1 = opts.startAngle * DEG_TO_RAD,
        delta  = opts.endAngle,
        phi    = this._tilt * DEG_TO_RAD;

    var cosPhi    = Math.cos(phi), sinMPhi = Math.sin(-phi), sinPhi = Math.sin(phi);
    var sinTheta1 = Math.sin(theta1), cosTheta1 = Math.cos(theta1);
    var sinTheta2 = Math.sin(theta2), cosTheta2 = Math.cos(theta2);

    // Determine start and end-point coordinates
    var x0 = c.x + cosPhi * rx * cosTheta1 + sinMPhi * ry * sinTheta1;
    var y0 = c.y + sinPhi * rx * cosTheta1 + cosPhi  * ry * sinTheta1;

    var x1 = c.x + cosPhi * rx * cosTheta2 + sinMPhi * ry * sinTheta2;
    var y1 = c.y + sinPhi * rx * cosTheta2 + cosPhi  * ry * sinTheta2;

    return {
      'x0':       x0,
      'y0':       y0,
      'tilt':     phi,
      'largeArc': (delta > 180) ? 1 : 0,
      'sweep':    (delta > 0)   ? 1 : 0,
      'x1':       x1,
      'y1':       y1
    };
  },


  /**
   * Checks if ellipse is visible or inside of the viewport
   * @return {Boolean}
   */
  _empty: function () {
    return this._mRadiusX &&
      !this._renderer._bounds.contains(this._pxBounds) &&
      !this._renderer._bounds.intersects(this._pxBounds);
  },


  /**
   * Point in ellipse checker
   * https://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse/76463#76463
   * @param  {L.Point} p
   * @return {Boolean}
   */
  _containsPoint: function (p) {
    var c = this._point;
    var padding = this._clickTolerance();
    var dx = (p.x - c.x), dy = (p.y - c.y);
    var rx = this._radiusX + padding, ry = this._radiusY + padding;
  	return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
  },

});


/**
 * Factory
 * @param  {L.LatLng} latlng
 * @param  {Object}   options
 * @return {L.Ellipse}
 */
L.ellipse = function (latlng, options) {
  return new L.Ellipse(latlng, options);
};


/**
 * SVG/VML paths
 * @param {L.Point} center
 * @param {Object}  endPoint
 * @param {Number}  rx
 * @param {Number}  ry
 * @param {Number}  phi
 */
L.SVG.getEllipsePath = L.Browser.svg ? function (center, endPoint, rx, ry, phi) {
  return 'M' + endPoint.x0 + ',' + endPoint.y0 +
         'A' + rx + ',' + ry + ',' + phi + ',' +
         endPoint.largeArc + ',' + endPoint.sweep + ',' +
         endPoint.x1 + ',' + endPoint.y1 + ' z';
} : function (center, endPoint, rx, ry, phi) {
  var round = Math.round;
  return 'AL ' + round(center.x) + ',' + round(center.y) + ' ' +
         round(rx) + ',' + round(ry) +
         ' ' + phi + ',' + (65535 * 360);
};


L.SVG.include({

  /**
   * @param  {L.Ellipse} layer
   */
  _updateEllipse: function (layer) {
    var c = this._point, path,
        rx = this._radiusX,
        ry = this._radiusY,
        phi = this._tilt,
        endPoint = this._endPointParams;

    if (layer._empty()) {
      path = 'M0 0';
    }

    this._setPath(layer,
      L.SVG.getEllipsePath(layer._point,   layer._endPointParams,
                           layer._radiusX, layer._radiusY, layer._tilt));
  }

});


L.Canvas.include({

  /**
   * @param  {L.Ellipse} layer
   */
  _updateEllipse: function (layer) {
    if (layer._empty()) { return; }

    var p = layer._point,
        ctx = this._ctx,
        r = layer._radiusX,
        s = (layer._radiusY || r) / r;

    this._drawnLayers[layer._leaflet_id] = layer;

    if (s !== 1) {
    	ctx.save();
    	ctx.scale(1, s);
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

    if (s !== 1) {
    	ctx.restore();
    }

    this._fillStroke(ctx, layer);
  }
});

});
