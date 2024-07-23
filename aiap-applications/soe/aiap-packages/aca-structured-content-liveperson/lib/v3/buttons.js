/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const buttons = (attachments = []) => {
  const template = {
    type: 'vertical',
    elements: [],
  };

  const getClick = ({ title, url, payload }) => {
    if (url) {
      return { actions: [{ type: 'link', name: title, uri: url }] };
    }
    return { actions: [{ type: 'publishText', text: payload }] };
  };

  attachments.forEach(item => {
    template.elements.push({
      type: 'button',
      tooltip: item.title,
      title: item.title,
      click: getClick(item),
    });
  });

  return template;
};
module.exports = buttons;
