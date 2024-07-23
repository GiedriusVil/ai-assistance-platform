/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const buttons = ({ before, buttons }) => {
  const template = {
    type: 'template',
    payload: {
      template_type: 'button',
      text: before,
      buttons: [],
    },
  };

  buttons.forEach(button => {
    template.payload.buttons.push({
      type: 'button',
      title: button.text,
      image: button.image,
      url: button.link,
    });
  });

  return template;
};

module.exports = buttons;
