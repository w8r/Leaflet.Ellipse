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
var MAX_DEG    = 360 - 1e-4;


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
   * @param  {Number} options.rotation   Rotation angle (deg)
   * @param  {Number} options.startAngle Start angle (deg)
   * @param  {Number} options.endAngle   End angle (deg)
   */
  initialize: function (latlng, options) {
    L.Util.setOptions(this, options);
    this.setLatLng(latlng);

    this.setRotation(this.options.rotation || 0, true);
    this.setAngles(this.options.startAngle, this.options.endAngle, true);

    this.setRadius(options.radius);
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
   * @param {Number} rotation
   */
  setRotation: function (rotation, noRedraw) {
    this._rotation = rotation * DEG_TO_RAD;

    // cache sin and cos for point-in-ellipse calculation
    this._sinTheta = Math.sin(this._rotation);
    this._cosTheta = Math.cos(this._rotation);
    return noRedraw ? this : this.redraw();
  },


  /**
   * Set start and end angles
   * @param {Number} startAngle
   * @param {Number} endAngle
   * @param {Boolean=} noRedraw
   * @return {L.Ellipse}
   */
  setAngles: function (startAngle, endAngle, noRedraw) {
    startAngle = Math.min(Math.max(startAngle, 0), MAX_DEG);
    endAngle   = Math.min(Math.max(endAngle,   0), MAX_DEG);
    this.options.startAngle = Math.min(startAngle, endAngle);
    this.options.endAngle   = Math.max(startAngle, endAngle);
    return noRedraw ? this : this.redraw();
  },


  /**
   * For some reason it requires a hard redraw to show up
   * @return {L.Ellipse}
   */
  redraw: function () {
    L.Path.prototype.redraw.call(this);
    if (this._renderer) {
			this._renderer._update();
		}
    return this;
  },


  _updateBounds: function () {
    var map      = this._map;
    var w        = this._clickTolerance();
    var padding  = new L.Point(w, -w);
    var bounds   = this.getBounds();

    if (bounds.isValid()) {
      this._pxBounds = new L.Bounds(
        map.latLngToLayerPoint(bounds.getSouthWest())._subtract(padding),
        map.latLngToLayerPoint(bounds.getNorthEast())._add(padding));
    } else {
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
    var rx  = this._radiusX, ry = this._radiusY;
    var cx  = this._point.x, cy = this._point.y;
    var cos = this._cosTheta, sin = this._sinTheta;

    var offset = [Math.sqrt(rx * rx * cos * cos + ry * ry * sin * sin),
                  Math.sqrt(rx * rx * sin * sin + ry * ry * cos * cos)];

  	return new L.LatLngBounds(
  		this._map.layerPointToLatLng(this._point.subtract(offset)),
  		this._map.layerPointToLatLng(this._point.add(offset)));
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
        delta  = opts.endAngle * DEG_TO_RAD,
        phi    = this._rotation;

    var cosPhi    = Math.cos(phi), sinMPhi = Math.sin(-phi), sinPhi = Math.sin(phi);
    var sinTheta1 = Math.sin(theta1), cosTheta1 = Math.cos(theta1);
    var sinTheta2 = Math.sin(theta2), cosTheta2 = Math.cos(theta2);

    // Determine start and end-point coordinates
    var x0 = c.x + cosPhi * rx * cosTheta1 - sinMPhi * ry * sinTheta1;
    var y0 = c.y + sinPhi * rx * cosTheta1 + cosPhi  * ry * sinTheta1;

    var x1 = c.x + cosPhi * rx * cosTheta2 + sinMPhi * ry * sinTheta2;
    var y1 = c.y + sinPhi * rx * cosTheta2 + cosPhi  * ry * sinTheta2;

    return {
      'x0':       x0,
      'y0':       y0,
      'delta':    delta,
      'rotation': phi,
      'largeArc': (delta > Math.PI) ? 1 : 0,
      'sweep':    (delta < 0)   ? 1 : 0,
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
   * Point in ellipse checker, uses ellipse equasion
   *
   * @param  {L.Point} p
   * @return {Boolean}
   */
  _containsPoint: function (p) {
    var c       = this._point;
    var padding = this._clickTolerance();
    var cos     = this._cosTheta,
        sin     = this._sinTheta;
    var dx      = (p.x - c.x), dy = (p.y - c.y);
    var rx      = this._radiusX + padding,
        ry      = this._radiusY + padding;
    var tdx     = cos * dx + sin * dy,
        tdy     = sin * dx - cos * dy;

  	return (tdx * tdx) / (rx * rx) + (tdy * tdy) / (ry * ry) <= 1;
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


L.SVG.include({

  /**
   * @param  {L.Ellipse} layer
   */
  _updateEllipse: function (layer) {
    var rx  = layer._radiusX, ry  = layer._radiusY;
    var phi = layer._rotation / DEG_TO_RAD;

    var e = layer._endPointParams;
    var d = layer._empty() ? 'M0 0' :
        'M' + e.x1 + ' ' + e.y1 +
        ' A ' + rx + ' ' + ry + ', ' +
        phi + ', ' +
        e.largeArc + ' ' + e.sweep + ', ' + e.x0 + ' ' + e.y0;

		this._setPath(layer, d);
  }

});


if (!CanvasRenderingContext2D.prototype.ellipse) {
  /**
   * Canvas2D ellipse polyfill
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} radiusX
   * @param  {Number} radiusY
   * @param  {Number} rotation Radians
   * @param  {Number} startAngle Degrees
   * @param  {Number} endAngle Degrees
   * @param  {Boolean} antiClockwise
   */
  CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY,
        rotation, startAngle, endAngle, antiClockwise) {
    this.save();
    this.translate(x, y);
    this.rotate(rotation);
    this.scale(radiusX, radiusY);
    this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    this.restore();
  }
}

L.Canvas.include({

  /**
   * @param  {L.Ellipse} layer
   */
  _updateEllipse: function (layer) {
    if (layer._empty()) { return; }

    var p = layer._point,
        options = layer.options,
        ctx = this._ctx;

    this._drawnLayers[layer._leaflet_id] = layer;

    ctx.beginPath();
    ctx.ellipse(
      p.x, p.y,
      layer._radiusX, layer._radiusY,
      layer._rotation,
      options.startAngle * DEG_TO_RAD,
      options.endAngle * DEG_TO_RAD, false);
    ctx.closePath();

    this._fillStroke(ctx, layer);
  }
});

});
