/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
describe('carousel structured message', () => {
  jest.unmock('../carousel');

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const carouselDataWithLinks = {
    type: 'carousel',
    attachments: [
      {
        title: 'first',
        image_url: 'https://petersfancybrownhats.com/company_image.png',
        subtitle: 'first subtitle',
        buttons: [
          { type: 'web_url', title: 'First button', url: 'https://firstlink.com' },
          { type: 'web_url', title: 'Second button', url: 'https://secondlink.com' },
        ],
        default_action: { type: 'web_url', url: 'https://petersfancybrownhats.com/view?item=101' },
      },
      {
        title: 'second',
        image_url: 'https://petersfancybrownhats.com/company_image.png',
        subtitle: 'second subtitle',
        buttons: [
          { type: 'web_url', title: 'First button', url: 'https://firstlink.com' },
          { type: 'web_url', title: 'Second button', url: 'https://secondlink.com' },
        ],
        default_action: { type: 'web_url', url: 'https://petersfancybrownhats.com/view?item=102' },
      },
    ],
  };
  const carouselDataWithPayload = {
    type: 'carousel',
    attachments: [
      {
        title: 'first',
        image_url: 'https://petersfancybrownhats.com/company_image.png',
        subtitle: 'first subtitle',
        buttons: [
          { type: 'web_url', title: 'First button', payload: 'first_button' },
          { type: 'web_url', title: 'Second button', payload: 'second_button' },
        ],
        default_action: { type: 'web_url', url: 'https://petersfancybrownhats.com/view?item=101' },
      },
    ],
  };
  const transformedCarouselWithLinks = {
    type: 'carousel',
    padding: 10,
    elements: [
      {
        type: 'vertical',
        elements: [
          {
            type: 'image',
            url: 'https://petersfancybrownhats.com/company_image.png',
            click: { actions: [{ type: 'link', uri: 'https://petersfancybrownhats.com/view?item=101' }] },
          },
          { type: 'text', text: 'first', rtl: false, style: { bold: true, italic: false, color: '#000000' } },
          { type: 'text', text: 'first subtitle', rtl: false, style: { bold: false, italic: false, color: '#000000' } },
          {
            type: 'button',
            title: 'First button',
            click: { actions: [{ type: 'link', uri: 'https://firstlink.com' }] },
          },
          {
            type: 'button',
            title: 'Second button',
            click: { actions: [{ type: 'link', uri: 'https://secondlink.com' }] },
          },
        ],
      },
      {
        type: 'vertical',
        elements: [
          {
            type: 'image',
            url: 'https://petersfancybrownhats.com/company_image.png',
            click: { actions: [{ type: 'link', uri: 'https://petersfancybrownhats.com/view?item=102' }] },
          },
          { type: 'text', text: 'second', rtl: false, style: { bold: true, italic: false, color: '#000000' } },
          {
            type: 'text',
            text: 'second subtitle',
            rtl: false,
            style: { bold: false, italic: false, color: '#000000' },
          },
          {
            type: 'button',
            title: 'First button',
            click: { actions: [{ type: 'link', uri: 'https://firstlink.com' }] },
          },
          {
            type: 'button',
            title: 'Second button',
            click: { actions: [{ type: 'link', uri: 'https://secondlink.com' }] },
          },
        ],
      },
    ],
  };
  const transformedCarouselWithPayload = {
    type: 'carousel',
    padding: 10,
    elements: [
      {
        type: 'vertical',
        elements: [
          {
            type: 'image',
            url: 'https://petersfancybrownhats.com/company_image.png',
            click: { actions: [{ type: 'link', uri: 'https://petersfancybrownhats.com/view?item=101' }] },
          },
          { type: 'text', text: 'first', rtl: false, style: { bold: true, italic: false, color: '#000000' } },
          { type: 'text', text: 'first subtitle', rtl: false, style: { bold: false, italic: false, color: '#000000' } },
          {
            type: 'button',
            title: 'First button',
            click: { actions: [{ type: 'publishText', text: 'first_button' }] },
          },
          {
            type: 'button',
            title: 'Second button',
            click: { actions: [{ type: 'publishText', text: 'second_button' }] },
          },
        ],
      },
    ],
  };

  test('should construct structured message - button has link', () => {
    const carousel = require('../carousel');
    const structuredMessage = carousel(carouselDataWithLinks);

    const expectedStructuredMessage = JSON.stringify(transformedCarouselWithLinks);
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });

  test('should construct structured message - button has payload', () => {
    const carousel = require('../carousel');
    const structuredMessage = carousel(carouselDataWithPayload);

    const expectedStructuredMessage = JSON.stringify(transformedCarouselWithPayload);
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });
});
