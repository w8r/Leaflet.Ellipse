(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var center = [35, 54];
var flat = L.Util.extend({}, L.CRS.Simple, {
  transformation: new L.Transformation(1/1000, 0, -1/1000, 0)
});
var wgs  = L.CRS.EPSG4326;
var goog = L.CRS.EPSG3857;

L.Bounds.prototype.toString = function () {
  return [this.min.x, this.min.y, this.max.x, this.max.y].join(',');
}

var map  = global.map = L.map('map', {
  crs: flat,
  maxZoom: 22
}).setView(center, 14);

var canvasRenderer = new L.Canvas();
var circle = L.circle(center, {
  radius: 750,
  renderer: canvasRenderer
}).addTo(map);

var ellipse = global.ellipse = L.ellipse(center, {
  radius: [750, 1500],
  color: '#f00',
  weight: 2,
  rotation: 45,
  //renderer: canvasRenderer,
  interactive: true
}).addTo(map);

map.fitBounds(ellipse.getBounds(), { animate: false });

var form = document.querySelector('#ellipse-form');
function update () {
  var tilt    = parseFloat(form['tilt'].value);
  var radiusX = parseFloat(form['radiusX'].value);
  var radiusY = parseFloat(form['radiusY'].value);
  // var startAngle = parseFloat(form['startAngle'].value);
  // var endAngle   = parseFloat(form['endAngle'].value);
  // form['endAngle'].min = startAngle;
  // form['startAngle'].max = endAngle;

  ellipse.setRotation(tilt);
  ellipse.setRadius([radiusX, radiusY]);
  // ellipse.setAngles(startAngle, endAngle);
}

L.DomEvent
  .on(form, 'change', update)
  .on(form, 'submit', L.Util.falseFn);

update();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNlbnRlciA9IFszNSwgNTRdO1xudmFyIGZsYXQgPSBMLlV0aWwuZXh0ZW5kKHt9LCBMLkNSUy5TaW1wbGUsIHtcbiAgdHJhbnNmb3JtYXRpb246IG5ldyBMLlRyYW5zZm9ybWF0aW9uKDEvMTAwMCwgMCwgLTEvMTAwMCwgMClcbn0pO1xudmFyIHdncyAgPSBMLkNSUy5FUFNHNDMyNjtcbnZhciBnb29nID0gTC5DUlMuRVBTRzM4NTc7XG5cbkwuQm91bmRzLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFt0aGlzLm1pbi54LCB0aGlzLm1pbi55LCB0aGlzLm1heC54LCB0aGlzLm1heC55XS5qb2luKCcsJyk7XG59XG5cbnZhciBtYXAgID0gZ2xvYmFsLm1hcCA9IEwubWFwKCdtYXAnLCB7XG4gIGNyczogZmxhdCxcbiAgbWF4Wm9vbTogMjJcbn0pLnNldFZpZXcoY2VudGVyLCAxNCk7XG5cbnZhciBjYW52YXNSZW5kZXJlciA9IG5ldyBMLkNhbnZhcygpO1xudmFyIGNpcmNsZSA9IEwuY2lyY2xlKGNlbnRlciwge1xuICByYWRpdXM6IDc1MCxcbiAgcmVuZGVyZXI6IGNhbnZhc1JlbmRlcmVyXG59KS5hZGRUbyhtYXApO1xuXG52YXIgZWxsaXBzZSA9IGdsb2JhbC5lbGxpcHNlID0gTC5lbGxpcHNlKGNlbnRlciwge1xuICByYWRpdXM6IFs3NTAsIDE1MDBdLFxuICBjb2xvcjogJyNmMDAnLFxuICB3ZWlnaHQ6IDIsXG4gIHJvdGF0aW9uOiA0NSxcbiAgLy9yZW5kZXJlcjogY2FudmFzUmVuZGVyZXIsXG4gIGludGVyYWN0aXZlOiB0cnVlXG59KS5hZGRUbyhtYXApO1xuXG5tYXAuZml0Qm91bmRzKGVsbGlwc2UuZ2V0Qm91bmRzKCksIHsgYW5pbWF0ZTogZmFsc2UgfSk7XG5cbnZhciBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VsbGlwc2UtZm9ybScpO1xuZnVuY3Rpb24gdXBkYXRlICgpIHtcbiAgdmFyIHRpbHQgICAgPSBwYXJzZUZsb2F0KGZvcm1bJ3RpbHQnXS52YWx1ZSk7XG4gIHZhciByYWRpdXNYID0gcGFyc2VGbG9hdChmb3JtWydyYWRpdXNYJ10udmFsdWUpO1xuICB2YXIgcmFkaXVzWSA9IHBhcnNlRmxvYXQoZm9ybVsncmFkaXVzWSddLnZhbHVlKTtcbiAgLy8gdmFyIHN0YXJ0QW5nbGUgPSBwYXJzZUZsb2F0KGZvcm1bJ3N0YXJ0QW5nbGUnXS52YWx1ZSk7XG4gIC8vIHZhciBlbmRBbmdsZSAgID0gcGFyc2VGbG9hdChmb3JtWydlbmRBbmdsZSddLnZhbHVlKTtcbiAgLy8gZm9ybVsnZW5kQW5nbGUnXS5taW4gPSBzdGFydEFuZ2xlO1xuICAvLyBmb3JtWydzdGFydEFuZ2xlJ10ubWF4ID0gZW5kQW5nbGU7XG5cbiAgZWxsaXBzZS5zZXRSb3RhdGlvbih0aWx0KTtcbiAgZWxsaXBzZS5zZXRSYWRpdXMoW3JhZGl1c1gsIHJhZGl1c1ldKTtcbiAgLy8gZWxsaXBzZS5zZXRBbmdsZXMoc3RhcnRBbmdsZSwgZW5kQW5nbGUpO1xufVxuXG5MLkRvbUV2ZW50XG4gIC5vbihmb3JtLCAnY2hhbmdlJywgdXBkYXRlKVxuICAub24oZm9ybSwgJ3N1Ym1pdCcsIEwuVXRpbC5mYWxzZUZuKTtcblxudXBkYXRlKCk7XG4iXX0=
