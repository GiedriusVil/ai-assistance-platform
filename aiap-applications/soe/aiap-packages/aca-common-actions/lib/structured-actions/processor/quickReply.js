/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const process = quickReply => {
  const result = {
    attributes: quickReply.attrs,
    content: [],
  };
  quickReply.content.forEach(contentItem => {
    if (contentItem != null && typeof contentItem == 'object' && contentItem.tag === 'button') {
      result.content.push(contentItem);
    }
  });
  return result;
};

module.exports = {
  process,
};
