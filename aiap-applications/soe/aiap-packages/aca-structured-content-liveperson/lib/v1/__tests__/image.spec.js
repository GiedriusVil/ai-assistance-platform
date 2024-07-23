/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
describe('image structured message', () => {
  jest.unmock('../image');

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const paramsMock = {
    message: 'some message',
    url: 'some image url',
  };

  const template = {
    v: 1,
    layout: {
      type: 'vertical',
      elements: [
        {
          type: 'image',
          url: 'some image url',
          caption: 'some message',
          action: {},
          tooltip: 'image tooltip',
          rtl: true,
        },
      ],
    },
  };

  it('should construct structured message from image template', () => {
    const image = require('../image');
    const structuredMessage = image(paramsMock);

    const expectedStructuredMessage = 'lpsc:' + JSON.stringify(template);
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });
});
