/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const carousel = transformer => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: ({ tree, bot, update, before, after }) => {
    const carousel = {
      type: 'carousel',
      attachments: [],
    };
    tree.forEach(item => {
      if (typeof item === 'object' && item.tag == 'carousel') {
        item.content.forEach(element => {
          if (typeof element === 'object' && element.tag == 'element') {
            let carouselItem = {
              title: element.attrs.title,
              buttons: [],
            };
            if (element.attrs && element.attrs.image_url) {
              carouselItem.image_url = element.attrs.image_url;
            }
            if (element.attrs && element.attrs.subtitle) {
              carouselItem.subtitle = element.attrs.subtitle;
            }

            element.content.forEach(control => {
              if (typeof control === 'object' && carouselItem.image_url && control.tag == 'default_action') {
                carouselItem.default_action = {
                  type: control.attrs.type,
                  url: control.attrs.url,
                };
              } else if (typeof control === 'object' && control.tag == 'button') {
                let button = {
                  type: control.attrs.type,
                  title: control.attrs.title,
                };
                if (control.attrs.url) {
                  button.url = control.attrs.url;
                } else {
                  button.payload = control.attrs.payload;
                }
                carouselItem.buttons.push(button);
              }
            });

            carousel.attachments.push(carouselItem);
          }
        });
      }
    });
    let transformedCarousel = '';
    if (before) {
      transformedCarousel = `${before}<pause />`;
    }
    transformedCarousel = transformedCarousel + transformer(carousel);
    if (after) {
      transformedCarousel = transformedCarousel + `<pause />${after}`;
    }
    const outgoingMessage = bot.createOutgoingMessageFor(update.sender.id);
    outgoingMessage.addText(transformedCarousel);
    bot.sendMessage(outgoingMessage);
  },
});

module.exports = {
  carousel,
};
