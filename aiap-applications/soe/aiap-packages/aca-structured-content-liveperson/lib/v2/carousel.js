/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const carousel = carousel => {
  const template = {
    type: 'carousel',
    padding: 10,
    elements: [],
  };

  carousel.attachments.forEach(item => {
    let carouselItem = {
      type: 'vertical',
      elements: [],
    };
    if (item.image_url) {
      const image = {
        type: 'image',
        url: item.image_url,
      };
      if (item.default_action) {
        const actions = {
          actions: [
            {
              type: 'link',
              uri: item.default_action.url,
            },
          ],
        };
        image.click = actions;
      }

      carouselItem.elements.push(image);
    }

    if (item.title) {
      carouselItem.elements.push({
        type: 'text',
        text: item.title,
        rtl: false,
        style: {
          bold: true,
          italic: false,
          color: '#000000',
        },
      });
    }

    if (item.subtitle) {
      carouselItem.elements.push({
        type: 'text',
        text: item.subtitle,
        rtl: false,
        style: {
          bold: false,
          italic: false,
          color: '#000000',
        },
      });
    }

    if (item.buttons) {
      item.buttons.forEach(button => {
        const elementButton = {
          type: 'button',
          title: button.title,
        };

        const click = { actions: [] };
        if (button.url) {
          click.actions.push({ type: 'link', uri: button.url });
        } else if (button.payload) {
          click.actions.push({ type: 'publishText', text: button.payload });
        }
        elementButton.click = click;
        carouselItem.elements.push(elementButton);
      });
    }

    template.elements.push(carouselItem);
  });
  const createJSON = () => {
    return JSON.stringify(template);
  };
  return createJSON();
};

module.exports = carousel;
