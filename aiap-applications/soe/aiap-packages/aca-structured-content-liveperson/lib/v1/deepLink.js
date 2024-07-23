/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const deepLink = params => {
  const { title, link } = params;

  const PREFIX = 'lpsc:';
  const template = {
    v: 1,
    layout: {
      type: 'vertical',
      elements: [
        {
          type: 'text',
          title: title,
        },
        {
          type: 'button',
          title: title,
          action: {
            type: 'link',
            uri: link,
            name: title,
          },
        },
      ],
    },
  };
  const createJSON = () => {
    return PREFIX + JSON.stringify(template);
  };
  return createJSON();
};
module.exports = deepLink;
