/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transform = result => {
  let ret = [];
  result.forEach(element => {
    delete element.enriched_title;
    delete element.enriched_text;
    ret.push(element);
  });
  return ret;
};

module.exports = {
  transform,
};
