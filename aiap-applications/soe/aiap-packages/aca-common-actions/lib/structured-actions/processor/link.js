/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const process = link => {
  if (link) {
    const result = { url: link.attrs.url, title: link.attrs.title };
    return R.reject(v => v == null, result);
  }
  return null;
};

module.exports = {
  process,
};
