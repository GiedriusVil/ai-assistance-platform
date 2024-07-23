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
  const LINK_MOCK = 'nw://some-uri';
  const TITLE_MOCK = 'some title';

  const getTemplate = (url, link, title) => {
    const obj = {
      type: 'vertical',
      elements: [
        {
          type: 'image',
          url: url,
          tooltip: title || '',
        },
      ],
    };

    if (link) {
      obj.elements[0].click = {
        actions: [
          {
            type: 'link',
            name: title || '',
            uri: link,
          },
        ],
      };
    }

    return obj;
  };

  it('should construct structured message with url only', () => {
    const image = require('../image');
    const structuredMessage = image({ url: URL_MOCK });

    const expectedStructuredMessage = JSON.stringify(getTemplate(URL_MOCK));
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });

  it('should construct structured message with url and link', () => {
    const image = require('../image');
    const structuredMessage = image({ url: URL_MOCK, link: LINK_MOCK });

    const expectedStructuredMessage = JSON.stringify(getTemplate(URL_MOCK, LINK_MOCK));
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });

  it('should construct structured message with url, link and title', () => {
    const image = require('../image');
    const structuredMessage = image({ url: URL_MOCK, link: LINK_MOCK, title: TITLE_MOCK });

    const expectedStructuredMessage = JSON.stringify(getTemplate(URL_MOCK, LINK_MOCK, TITLE_MOCK));
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });

  it('should construct structured message with url and title', () => {
    const image = require('../image');
    const structuredMessage = image({ url: URL_MOCK, title: TITLE_MOCK });

    const expectedStructuredMessage = JSON.stringify(getTemplate(URL_MOCK, null, TITLE_MOCK));
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });
});
