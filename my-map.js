var defaultMap = require('./default-map')
var mapFromHash = require('./map-from-hash')


if (window.location.hash.length > 2) {
  mapInfo = mapFromHash();
} else {
  mapInfo = defaultMap;
}


module.exports = mapInfo;
