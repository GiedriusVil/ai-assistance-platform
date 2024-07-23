/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  carousel,
  audio,
  video,
  image,
  link,
  file,
  widget,
  card,
  list,
  quickReply,
} = require('./lib/structured-actions');
const { form } = require('./lib/form-actions');
const { feedback } = require('./lib/feedback');
const { datePicker } = require('./lib/datepicker');
const { googlePlaces, googleMap, getLocation } = require('./lib/location');

module.exports = {
  image,
  file,
  video,
  audio,
  link,
  carousel,
  form,
  feedback,
  widget,
  card,
  list,
  quickReply,
  datePicker,
  googlePlaces,
  googleMap,
  getLocation,
};
