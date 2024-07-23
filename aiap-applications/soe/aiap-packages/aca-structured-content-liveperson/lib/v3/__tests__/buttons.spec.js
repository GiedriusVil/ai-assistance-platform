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

  const YES_MOCK = 'yes';
  const NO_MOCK = 'no';
  const LINK_MOCK = 'nw://some-uri';

  const paramsWithLinkMock = [{ title: YES_MOCK, url: LINK_MOCK }, { title: NO_MOCK, url: LINK_MOCK }];

  const paramsWithoutLinkMock = [{ title: YES_MOCK, payload: YES_MOCK }, { title: NO_MOCK, payload: NO_MOCK }];

  const getEmptyTemplate = () => {
    return {
      type: 'vertical',
      elements: [],
    };
  };

  const getTemplate = (yes, no, link) => {
    const obj = {
      type: 'vertical',
      elements: [
        {
          type: 'button',
          tooltip: yes,
          title: yes,
        },
        {
          type: 'button',
          tooltip: no,
          title: no,
        },
      ],
    };

    if (link) {
      obj.elements[0].click = { actions: [{ type: 'link', name: yes || '', uri: link }] };
      obj.elements[1].click = { actions: [{ type: 'link', name: no || '', uri: link }] };
    } else {
      obj.elements[0].click = { actions: [{ type: 'publishText', text: yes }] };
      obj.elements[1].click = { actions: [{ type: 'publishText', text: no }] };
    }

    return obj;
  };

  it('should construct structured message - button has link', () => {
    const buttons = require('../buttons');
    const structuredMessage = buttons(paramsWithLinkMock);

    const expectedStructuredMessage = getTemplate(YES_MOCK, NO_MOCK, LINK_MOCK);
    expect(structuredMessage).toMatchObject(expectedStructuredMessage);
  });

  it('should construct structured message - button has no link', () => {
    const buttons = require('../buttons');
    const structuredMessage = buttons(paramsWithoutLinkMock);

    const expectedStructuredMessage = getTemplate(YES_MOCK, NO_MOCK);
    expect(structuredMessage).toMatchObject(expectedStructuredMessage);
  });

  it('should return undefined if attachments not defined', () => {
    const buttons = require('../buttons');
    const structuredMessage = buttons();

    const expectedStructuredMessage = getEmptyTemplate();
    expect(structuredMessage).toMatchObject(expectedStructuredMessage);
  });

  it('should return undefined if attachments array is empty', () => {
    const buttons = require('../buttons');
    const structuredMessage = buttons([]);

    const expectedStructuredMessage = getEmptyTemplate();
    expect(structuredMessage).toMatchObject(expectedStructuredMessage);
  });
});
