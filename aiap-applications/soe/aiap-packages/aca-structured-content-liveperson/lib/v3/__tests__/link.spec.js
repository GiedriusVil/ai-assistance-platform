/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
describe('link structured message', () => {
  jest.unmock('../link');

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const paramsMock = [
    {
      title: 'some title',
      url: 'some link',
    },
  ];

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

  it('should construct structured message from link template', () => {
    const link = require('../link');
    const structuredMessage = link(paramsMock);
    expect(structuredMessage).toMatchObject(template);
  });

  it('should returned undefined if no empty attachment list', () => {
    const link = require('../link');
    const attachments = [];
    const structuredMessage = link(attachments);

    expect(structuredMessage).toBeUndefined();
  });

  it('should returned undefined if no params passed', () => {
    const link = require('../link');
    const structuredMessage = link();

    expect(structuredMessage).toBeUndefined();
  });
});
