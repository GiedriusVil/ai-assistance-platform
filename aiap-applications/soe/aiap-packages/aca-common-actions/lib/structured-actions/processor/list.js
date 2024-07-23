/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const process = list => {
  const result = [];

  list.content.forEach(contentItem => {
    if (contentItem != null && typeof contentItem == 'object' && contentItem.tag === 'element') {
      contentItem.content.forEach(item => {
        if (item != null && typeof item == 'object' && item.tag === 'button') {
          result.push({ attributes: contentItem.attrs, content: item });
        }
      });
    }
  });
  return result;
};

module.exports = {
  process,
};
