/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const process = video => {
  if (video) {
    const result = { title: video.attrs.title, url: video.attrs.url, data: video.content };
    return R.reject(v => v == null, result);
  }
  return null;
};

module.exports = {
  process,
};
