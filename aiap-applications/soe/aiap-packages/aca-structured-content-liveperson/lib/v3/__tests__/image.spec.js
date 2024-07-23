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

  const URL_MOCK = 'some url';
  const TITLE_MOCK = 'some title';

  const getTemplate = (url, title) => {
    return {
      type: 'vertical',
      elements: [
        {
          type: 'image',
          url: url,
          tooltip: title || '',
          click: {
            actions: [
              {
                type: 'link',
                name: title || '',
                uri: url,
              },
            ],
          },
        },
      ],
    };
  };

  it('should construct structured message with url only', () => {
    const image = require('../image');
    const attachments = [{ url: URL_MOCK }];
    const structuredMessage = image(attachments);

    const expectedStructuredMessage = getTemplate(URL_MOCK);
    expect(structuredMessage).toMatchObject(expectedStructuredMessage);
  });

  it('should construct structured message with url and title', () => {
    const image = require('../image');
    const attachments = [{ url: URL_MOCK, title: TITLE_MOCK }];
    const structuredMessage = image(attachments);

    const expectedStructuredMessage = getTemplate(URL_MOCK, TITLE_MOCK);
    expect(structuredMessage).toMatchObject(expectedStructuredMessage);
  });

  it('should returned undefined if no empty attachment list', () => {
    const image = require('../image');
    const attachments = [];
    const structuredMessage = image(attachments);

    expect(structuredMessage).toBeUndefined();
  });

  it('should returned undefined if no params passed', () => {
    const image = require('../image');
    const structuredMessage = image();

    expect(structuredMessage).toBeUndefined();
  });
});
