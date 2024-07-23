/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Image = params => {
  const { message, url } = params;

  const PREFIX = 'lpsc:';
  const template = {
    v: 1,
    layout: {
      type: 'vertical',
      elements: [
        {
          type: 'image',
          url: url,
          caption: message,
          action: {},
          tooltip: 'image tooltip',
          rtl: true,
        },
      ],
    },
  };

  const createJSON = () => {
    return PREFIX + JSON.stringify(template);
  };
  return createJSON();
};
module.exports = Image;
