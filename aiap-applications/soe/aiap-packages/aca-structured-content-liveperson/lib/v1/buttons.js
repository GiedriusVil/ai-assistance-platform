/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const buttons = params => {
  const { buttons } = params;

  const PREFIX = 'lpsc:';
  const template = {
    v: 1,
    layout: {
      type: 'vertical',
      elements: [],
    },
  };

  buttons.forEach(button => {
    template.layout.elements.push({
      type: 'button',
      title: button.text,
      action: {
        type: 'publishText',
        text: button.text,
      },
      tooltip: button.text,
      rtl: false,
    });
  });
  const createJSON = () => {
    return PREFIX + JSON.stringify(template);
  };
  return createJSON();
};
module.exports = buttons;
