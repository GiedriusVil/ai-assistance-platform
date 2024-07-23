/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const elementProcessor = require('./element');

const process = carousel => {
  const result = [];
  carousel.content.forEach(contentItem => {
    if (contentItem != null && typeof contentItem == 'object' && contentItem.tag == 'element') {
      result.push(elementProcessor.process(contentItem));
    }
  });
  return result;
};

module.exports = {
  process,
};
