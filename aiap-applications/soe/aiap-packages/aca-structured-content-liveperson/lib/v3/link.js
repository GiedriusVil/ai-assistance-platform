/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const link = (attachments = []) => {
  if (attachments.length !== 1) return;

  const { url, title } = attachments[0];

  return {
    type: 'button',
    tooltip: title,
    title: title,
    click: {
      actions: [
        {
          type: 'link',
          name: title,
          uri: url,
        },
      ],
    },
  };
};
module.exports = link;
