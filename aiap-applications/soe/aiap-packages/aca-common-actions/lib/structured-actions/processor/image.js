/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const process = image => {
  if (image) {
    const result = {
      title: image.attrs.title,
      url: image.attrs.url,
      data: image.content,
      message: image.attrs.message,
    };
    return R.reject(v => v == null, result);
  }
  return null;
};

module.exports = {
  process,
};
