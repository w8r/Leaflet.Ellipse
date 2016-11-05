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
}).addTo(map);

var ellipse = global.ellipse = L.ellipse(center, {
  radius: [750, 1500],
  color: '#f00',
  weight: 2,
  //tilt: 45,
  //renderer: canvasRenderer,
  interactive: true
}).addTo(map);

map.fitBounds(ellipse.getBounds(), { animate: false });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjZW50ZXIgPSBbMzUsIDU0XTtcbnZhciBmbGF0ID0gTC5VdGlsLmV4dGVuZCh7fSwgTC5DUlMuU2ltcGxlLCB7XG4gIHRyYW5zZm9ybWF0aW9uOiBuZXcgTC5UcmFuc2Zvcm1hdGlvbigxLzEwMDAsIDAsIC0xLzEwMDAsIDApXG59KTtcbnZhciB3Z3MgID0gTC5DUlMuRVBTRzQzMjY7XG52YXIgZ29vZyA9IEwuQ1JTLkVQU0czODU3O1xuXG52YXIgbWFwICA9IGdsb2JhbC5tYXAgPSBMLm1hcCgnbWFwJywge1xuICBjcnM6IGZsYXQsXG4gIG1heFpvb206IDIyXG59KS5zZXRWaWV3KGNlbnRlciwgMTQpO1xuXG52YXIgY2FudmFzUmVuZGVyZXIgPSBuZXcgTC5DYW52YXMoKTtcbnZhciBjaXJjbGUgPSBMLmNpcmNsZShjZW50ZXIsIHtcbiAgcmFkaXVzOiA3NTAsXG4gIHJlbmRlcmVyOiBjYW52YXNSZW5kZXJlclxufSkuYWRkVG8obWFwKTtcblxudmFyIGVsbGlwc2UgPSBnbG9iYWwuZWxsaXBzZSA9IEwuZWxsaXBzZShjZW50ZXIsIHtcbiAgcmFkaXVzOiBbNzUwLCAxNTAwXSxcbiAgY29sb3I6ICcjZjAwJyxcbiAgd2VpZ2h0OiAyLFxuICAvL3RpbHQ6IDQ1LFxuICAvL3JlbmRlcmVyOiBjYW52YXNSZW5kZXJlcixcbiAgaW50ZXJhY3RpdmU6IHRydWVcbn0pLmFkZFRvKG1hcCk7XG5cbm1hcC5maXRCb3VuZHMoZWxsaXBzZS5nZXRCb3VuZHMoKSwgeyBhbmltYXRlOiBmYWxzZSB9KTtcbiJdfQ==
