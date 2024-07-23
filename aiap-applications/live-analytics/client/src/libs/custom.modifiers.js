/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
let custom = {
  resizeRequired: true,

  windowResize: () => {
    let windowWidth = $(window).width();
    let windowHeight = $(window).height();
    let headerHeight = $('.bx--header').height();

    $('.full-width').each((index, element) => {
      $(element).css({'width': windowWidth});
    });

    $('.full-height').each((index, element) => {
      $(element).css({'height': windowHeight});
    });

    $('.center-vertically').each((index, element) => {
      $(element).css({'marginTop': Math.round((windowHeight - $(element).height()) / 2)});
    });

    $('.bx--content').each((index, element) => {
      let bxContentHeight = $(element).height();
      let calculatedHeight = windowHeight - headerHeight- 1;

      if (bxContentHeight < calculatedHeight) {
        $(element).css({'min-height': calculatedHeight - 1})
      }
    });

    $('.bx--modal-container').each((index, element) => {
      let modalContainer = $(element).height();
      $(element).find('.bx--modal-content').each((i, e) => {
        let modalInner = (35 + 24) + $(e).height() + 104;
        if (modalInner >= modalContainer) {
          let overhead = modalContainer - (35 + 24) - 104;
          $(e).css({ 'height': overhead });
         // let height = overhead - (62 + 32 + 14 + 8 + 40 + 8 + 48);
          let height = overhead - (62 + 32 + 14 + 40 );
          if (height > 0) {
            $(element).find('.intents-list').css({ 'height': height, 'visibility': 'visible', 'opacity': 1 });
          }
         // $(element).find('.intents-list').css({ 'height': overhead - (62 + 32 + 14 + 8 + 40 + 8 + 48) });
        }
      });
    });

    $('.bx--chat-widget').each((index, element) => {
      let calculatedHeight = windowHeight - headerHeight;
      $(element).css({'height': calculatedHeight});
      $(element).find('iframe').each((i, e) => {
        $(e).css({'height': calculatedHeight - 40, 'width': 460});
      });
    });

    custom.resizeRequired = false;
  },

  resetValues: () => {
    $('.bx--modal-content').each((index, element) => {
      $(element).removeAttr('style');
      $(element).find('.intents-list').removeAttr('style');
    });
    custom.resizeRequired = true;
  },

  triggerResizeRequired: () => {
    for (let i = 0; i <= 5; i++) {
      setTimeout(() => {
        custom.resetValues();
      }, 0);
    }
  }
};

$(document).ready(() => {
  const mutationConfig = {
    attributes: true,
    childList: true
  };

  const observer = new MutationObserver(() => {
    custom.triggerResizeRequired();
  });

  observer.observe(document.getElementById('bx--body'), mutationConfig);

  $(window).resize(() => {
    custom.triggerResizeRequired();
  });

  setInterval(() => {
    if (custom.resizeRequired) {
      custom.windowResize();
    }
  }, 0);

  custom.triggerResizeRequired();
});
