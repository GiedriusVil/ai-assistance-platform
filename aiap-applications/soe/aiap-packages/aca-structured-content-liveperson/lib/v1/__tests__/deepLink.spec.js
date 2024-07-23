/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
describe('deepLink structured message', () => {
  jest.unmock('../deepLink');

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const paramsMock = {
    title: 'some title',
    link: 'some link',
  };

  const template = {
    v: 1,
    layout: {
      type: 'vertical',
      elements: [
        {
          type: 'text',
          title: 'some title',
        },
        {
          type: 'button',
          title: 'some title',
          action: {
            type: 'link',
            uri: 'some link',
            name: 'some title',
          },
        },
      ],
    },
  };

  it('should construct structured message from deepLink template', () => {
    const deepLink = require('../deepLink');
    const structuredMessage = deepLink(paramsMock);

    const expectedStructuredMessage = 'lpsc:' + JSON.stringify(template);
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });
});
