/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const getLocation = require('./get-location');
const { googleMap } = require('./google-map');
const { googlePlaces } = require('./google-places');



module.exports = {
  googlePlaces,
  googleMap,
  getLocation,
};
