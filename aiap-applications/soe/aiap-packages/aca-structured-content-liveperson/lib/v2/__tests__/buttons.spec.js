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

  const paramsWithLinkMock = {
    buttons: [{ text: YES_MOCK, link: LINK_MOCK }, { text: NO_MOCK, link: LINK_MOCK }],
  };

  const paramsWithoutLinkMock = {
    buttons: [{ text: YES_MOCK }, { text: NO_MOCK }],
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

    const expectedStructuredMessage = JSON.stringify(getTemplate(YES_MOCK, NO_MOCK, LINK_MOCK));
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });

  it('should construct structured message - button has no link', () => {
    const buttons = require('../buttons');
    const structuredMessage = buttons(paramsWithoutLinkMock);

    const expectedStructuredMessage = JSON.stringify(getTemplate(YES_MOCK, NO_MOCK));
    expect(structuredMessage).toBe(expectedStructuredMessage);
  });
});
