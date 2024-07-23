/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const image = (attachments = []) => {
  if (attachments.length !== 1) return;

  const { url, title } = attachments[0];

  return {
    type: 'vertical',
    elements: [
      {
        type: 'image',
        url: url,
        tooltip: title || '',
        click: {
          actions: [
            {
              type: 'link',
              name: title || '',
              uri: url,
            },
          ],
        },
      },
    ],
  };
};

module.exports = image;
