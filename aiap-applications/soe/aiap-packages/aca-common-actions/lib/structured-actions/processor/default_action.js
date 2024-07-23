/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const process = defaultAction => {
  if (defaultAction) {
    const result = {
      type: defaultAction.attrs.type,
      url: defaultAction.attrs.url,
      fallbackUrl: defaultAction.attrs.fallback_url,
    };
    return R.reject(v => v == null, result);
  }
  return null;
};

module.exports = {
  process,
};
