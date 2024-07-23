/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const process = widget => {
  if (widget) {
    const result = { type: widget.attrs.type, url: widget.attrs.url, data: widget.attrs.data };
    return R.reject(v => v == null, result);
  }
  return null;
};

module.exports = {
  process,
};
