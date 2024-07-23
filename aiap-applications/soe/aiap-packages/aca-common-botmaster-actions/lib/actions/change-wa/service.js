/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const getWCSData = update => {
  return {
    service: R.path(['session', 'wcs', 'service'], update),
    serviceDefault: R.path(['session', 'wcs', 'serviceDefault'], update),
    name: R.path(['session', 'wcs', 'name'], update),
    unavailableMessage: R.path(['session', 'wcs', 'unavailableMessage'], update),
  };
};

const setWCSData = (update, name, service, serviceDefault, unavailableMessage) => {
  update.session.wcs = update.session.wcs || {};
  update.session.wcs.name = name;
  if (service !== undefined) update.session.wcs.service = service;
  if (serviceDefault !== undefined) update.session.wcs.serviceDefault = serviceDefault;
  if (unavailableMessage) {
    update.session.wcs.unavailableMessage = unavailableMessage;
  } else {
    delete update.session.wcs.unavailableMessage;
  }
};

module.exports = {
  getWCSData,
  setWCSData,
};
