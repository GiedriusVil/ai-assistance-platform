/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Image = params => {
  const { url, link, title } = params;

  const imageTemplate = {
    type: 'vertical',
    elements: [
      {
        type: 'image',
        url: url,
        tooltip: title || '',
      },
    ],
  };

  const actionTemplate = {
    actions: [
      {
        type: 'link',
        name: title || '',
        uri: link,
      },
    ],
  };

  const createFromTemplate = () => {
    const image = imageTemplate;
    if (link) {
      image.elements[0].click = actionTemplate;
    }
    return image;
  };

  const createJSON = () => {
    return JSON.stringify(createFromTemplate());
  };
  return createJSON();
};
module.exports = Image;
