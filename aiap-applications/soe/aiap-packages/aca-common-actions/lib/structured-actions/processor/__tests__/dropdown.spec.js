/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
jest.unmock('../dropdown');

describe('dropdown tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should process all buttons', async () => {
    const dropdown = require('../dropdown');
    const passedButtons = {
      tag: 'buttons',
      attrs: { caption: 'testtest' },
      content: [
        {
          tag: 'button',
          attrs: { type: 'postback', title: 'test1but', url: 'http://test2.url', payload: 'test2payload' },
        },
        {
          tag: 'button',
          attrs: { type: 'postback', title: 'test2but', url: 'http://test2.url', payload: 'test2payload' },
        },
      ],
    };
    const processedButtons = dropdown.process(passedButtons, {});
    expect(processedButtons).toHaveLength(2);
    expect(processedButtons[0]).toHaveProperty('title');
    expect(processedButtons[0]).toHaveProperty('type');
    expect(processedButtons[0]).toHaveProperty('url');
    expect(processedButtons[0]).toHaveProperty('payload');
    expect(processedButtons[1].url).toBe('http://test2.url');
  });

  it('should process element despite it contains only one string value', async () => {
    const dropdown = require('../dropdown');
    const passedButtons = {
      tag: 'buttons',
      attrs: { caption: 'testtest' },
      content: [
        'test',
        {
          tag: 'button',
          attrs: { type: 'postback', title: 'test2but', url: 'http://test2.url', payload: 'test2payload' },
        },
      ],
    };
    const processedButtons = dropdown.process(passedButtons, {});
    expect(processedButtons).toHaveLength(2);
    expect(processedButtons[0]).toHaveProperty('title');
    expect(processedButtons[0]).toHaveProperty('type');
    expect(processedButtons[0]).toHaveProperty('payload');
    expect(processedButtons[1].url).toBe('http://test2.url');
  });

  it('should split multiple buttons custom seperator', async () => {
    const dropdown = require('../dropdown');
    const passedButtons = {
      tag: 'button',
      attrs: { caption: 'testtest' },
      content: [
        'button1/button2/button3',
        {
          tag: 'button',
          attrs: { type: 'postback', title: 'test2but', url: 'http://test2.url', payload: 'test2payload' },
        },
      ],
    };
    const processedButtons = dropdown.process(passedButtons, { defaultSplit: '/' });
    expect(processedButtons).toHaveLength(4);
    expect(processedButtons[1].title).toBe('button2');
    expect(processedButtons[0]).toHaveProperty('type');
    expect(processedButtons[0]).toHaveProperty('payload');
    expect(processedButtons[3].title).toBe('test2but');
  });
});
