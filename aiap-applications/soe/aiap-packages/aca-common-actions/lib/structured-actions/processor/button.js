/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const process = buttonItem => {
  if (buttonItem) {
    const result = {
      title: buttonItem.attrs.title,
      type: buttonItem.attrs.type,
      url: buttonItem.attrs.url,
      payload: buttonItem.attrs.payload,
      tooltip: buttonItem.attrs.tooltip,
    };
    return R.reject(v => v == null, result);
  }
  return null;
};

module.exports = {
  process,
};
