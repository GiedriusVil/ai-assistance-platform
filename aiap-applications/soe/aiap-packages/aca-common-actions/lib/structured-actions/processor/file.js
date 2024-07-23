/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const process = fileItem => {
  if (fileItem) {
    const result = { title: fileItem.attrs.title, url: fileItem.attrs.url, data: fileItem.content };
    return R.reject(v => v == null, result);
  }
  return null;
};

module.exports = {
  process,
};
