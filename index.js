const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const getPixels = require('get-pixels');
const getRgbaPalette = require('get-rgba-palette');
const chroma = require('chroma-js');
const getSvgColors = require('get-svg-colors');

const patterns = {
  image: /\.(gif|jpg|png|svg)$/i,
  raster: /\.(gif|jpg|png)$/i,
  svg: /svg$/i
};

module.exports = function colorPalette (input, type, callback) {
  if (!callback) {
    callback = type;
    type = null;
  }

  // SVG
  if(!Buffer.isBuffer(input)) {
    if (input.match(patterns.svg)) {
      return callback(null, getSvgColors(input, {flat: true}));
    }
  } else if(type === 'image/svg') {
    return callback(null, getSvgColors(input, {flat: true}));
  }

  // PNG, GIF, JPG
  return paletteFromBitmap(input, type, callback)
};

function paletteFromBitmap (input, type, callback) {
  if (!callback) {
    callback = type;
    type = null;
  }

  getPixels(input, type, function (err, pixels) {
    if (err) return callback(err);
    const palette = getRgbaPalette(pixels.data, 5).map(function (rgba) {
      return chroma(rgba)
    });
    return callback(null, palette)
  })
}
