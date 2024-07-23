/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const process = card => {
  const result = {
    attributes: card.attrs,
    content: [],
  };
  card.content.forEach(contentItem => {
    if (contentItem != null && typeof contentItem == 'object' && contentItem.tag === 'button') {
      result.content.push(contentItem);
    }
  });
  return result;
};

module.exports = {
  process,
};
