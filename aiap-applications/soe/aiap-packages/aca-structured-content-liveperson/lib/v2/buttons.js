/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const buttons = params => {
  const { buttons } = params;

  const template = {
    type: 'vertical',
    elements: [],
  };

  const getClick = (text, link) => {
    if (link) {
      return { actions: [{ type: 'link', name: text, uri: link }] };
    }
    return { actions: [{ type: 'publishText', text: text }] };
  };

  buttons.forEach(button => {
    template.elements.push({
      type: 'button',
      tooltip: button.text,
      title: button.text,
      click: getClick(button.text, button.link),
    });
  });

  const createJSON = () => {
    return JSON.stringify(template);
  };

  return createJSON();
};
module.exports = buttons;
