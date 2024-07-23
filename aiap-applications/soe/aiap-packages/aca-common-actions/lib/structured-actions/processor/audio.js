/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('ramda');

const process = audio => {
  if (audio) {
    const result = { title: audio.attrs.title, url: audio.attrs.url, data: audio.content };
    return R.reject(v => v == null, result);
  }
  return null;
};

module.exports = {
  process,
};
