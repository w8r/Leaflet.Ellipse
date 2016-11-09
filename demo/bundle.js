(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var center = [35, 54];
var flat = L.Util.extend({}, L.CRS.Simple, {
  transformation: new L.Transformation(1/1000, 0, -1/1000, 0)
});
var wgs  = L.CRS.EPSG4326;
var goog = L.CRS.EPSG3857;

var map  = global.map = L.map('map', {
  crs: flat,
  maxZoom: 22
}).setView(center, 14);

var canvasRenderer = new L.Canvas();
var circle = L.circle(center, {
  radius: 750,
  renderer: canvasRenderer
});//.addTo(map);

var ellipse = global.ellipse = L.ellipse(center, {
  radius: [750, 1500],
  color: '#f00',
  weight: 2,
  rotation: 45,
  renderer: canvasRenderer,
  interactive: true
}).addTo(map);

map.fitBounds(ellipse.getBounds(), { animate: false });

var form = document.querySelector('#ellipse-form');
function update () {
  var tilt    = parseFloat(form['tilt'].value);
  var radiusX = parseFloat(form['radiusX'].value);
  var radiusY = parseFloat(form['radiusY'].value);

  ellipse.setRotation(tilt);
  ellipse.setRadius([radiusX, radiusY]);
}

L.DomEvent
  .on(form, 'change', update)
  .on(form, 'submit', L.Util.falseFn);

update();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNlbnRlciA9IFszNSwgNTRdO1xudmFyIGZsYXQgPSBMLlV0aWwuZXh0ZW5kKHt9LCBMLkNSUy5TaW1wbGUsIHtcbiAgdHJhbnNmb3JtYXRpb246IG5ldyBMLlRyYW5zZm9ybWF0aW9uKDEvMTAwMCwgMCwgLTEvMTAwMCwgMClcbn0pO1xudmFyIHdncyAgPSBMLkNSUy5FUFNHNDMyNjtcbnZhciBnb29nID0gTC5DUlMuRVBTRzM4NTc7XG5cbnZhciBtYXAgID0gZ2xvYmFsLm1hcCA9IEwubWFwKCdtYXAnLCB7XG4gIGNyczogZmxhdCxcbiAgbWF4Wm9vbTogMjJcbn0pLnNldFZpZXcoY2VudGVyLCAxNCk7XG5cbnZhciBjYW52YXNSZW5kZXJlciA9IG5ldyBMLkNhbnZhcygpO1xudmFyIGNpcmNsZSA9IEwuY2lyY2xlKGNlbnRlciwge1xuICByYWRpdXM6IDc1MCxcbiAgcmVuZGVyZXI6IGNhbnZhc1JlbmRlcmVyXG59KTsvLy5hZGRUbyhtYXApO1xuXG52YXIgZWxsaXBzZSA9IGdsb2JhbC5lbGxpcHNlID0gTC5lbGxpcHNlKGNlbnRlciwge1xuICByYWRpdXM6IFs3NTAsIDE1MDBdLFxuICBjb2xvcjogJyNmMDAnLFxuICB3ZWlnaHQ6IDIsXG4gIHJvdGF0aW9uOiA0NSxcbiAgcmVuZGVyZXI6IGNhbnZhc1JlbmRlcmVyLFxuICBpbnRlcmFjdGl2ZTogdHJ1ZVxufSkuYWRkVG8obWFwKTtcblxubWFwLmZpdEJvdW5kcyhlbGxpcHNlLmdldEJvdW5kcygpLCB7IGFuaW1hdGU6IGZhbHNlIH0pO1xuXG52YXIgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbGxpcHNlLWZvcm0nKTtcbmZ1bmN0aW9uIHVwZGF0ZSAoKSB7XG4gIHZhciB0aWx0ICAgID0gcGFyc2VGbG9hdChmb3JtWyd0aWx0J10udmFsdWUpO1xuICB2YXIgcmFkaXVzWCA9IHBhcnNlRmxvYXQoZm9ybVsncmFkaXVzWCddLnZhbHVlKTtcbiAgdmFyIHJhZGl1c1kgPSBwYXJzZUZsb2F0KGZvcm1bJ3JhZGl1c1knXS52YWx1ZSk7XG5cbiAgZWxsaXBzZS5zZXRSb3RhdGlvbih0aWx0KTtcbiAgZWxsaXBzZS5zZXRSYWRpdXMoW3JhZGl1c1gsIHJhZGl1c1ldKTtcbn1cblxuTC5Eb21FdmVudFxuICAub24oZm9ybSwgJ2NoYW5nZScsIHVwZGF0ZSlcbiAgLm9uKGZvcm0sICdzdWJtaXQnLCBMLlV0aWwuZmFsc2VGbik7XG5cbnVwZGF0ZSgpO1xuIl19
