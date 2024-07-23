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
    type: 'button',
    tooltip: 'some title',
    title: 'some title',
    click: {
      actions: [
        {
          type: 'link',
          name: 'some title',
          uri: 'some link',
        },
      ],
    },
  };

  it('should construct structured message from deepLink template', () => {
    const deepLink = require('../deepLink');
    const structuredMessage = deepLink(paramsMock);

    const expectedStructuredMessage = JSON.stringify(template);
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });
});
