/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
describe('buttons structured message', () => {
  jest.unmock('../buttons');

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const paramsMock = {
    buttons: [{ text: 'yes' }, { text: 'no' }],
  };

  const template = {
    v: 1,
    layout: {
      type: 'vertical',
      elements: [
        {
          type: 'button',
          title: 'yes',
          action: {
            type: 'publishText',
            text: 'yes',
          },
          tooltip: 'yes',
          rtl: false,
        },
        {
          type: 'button',
          title: 'no',
          action: {
            type: 'publishText',
            text: 'no',
          },
          tooltip: 'no',
          rtl: false,
        },
      ],
    },
  };

  it('should construct structured message from buttons template', () => {
    const buttons = require('../buttons');
    const structuredMessage = buttons(paramsMock);

    const expectedStructuredMessage = 'lpsc:' + JSON.stringify(template);
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });
});
