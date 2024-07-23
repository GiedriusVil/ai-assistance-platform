/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const deepLink = params => {
  const { title, link } = params;

  const template = {
    type: 'button',
    tooltip: title,
    title: title,
    click: {
      actions: [
        {
          type: 'link',
          name: title,
          uri: link,
        },
      ],
    },
  };
  const createJSON = () => {
    return JSON.stringify(template);
  };
  return createJSON();
};
module.exports = deepLink;
