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
