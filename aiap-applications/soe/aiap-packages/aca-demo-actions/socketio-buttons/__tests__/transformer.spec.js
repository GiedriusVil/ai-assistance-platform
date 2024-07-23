/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
jest.mock('@ibm-aca/aca-common-logger', () => jest.requireActual('@ibm-aca/aca-common-logger').mock);

const transformer = require('../transformer');

describe('Socketio Buttons Action Transformer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('Should test transform quick reply. transformQuickReplies', () => {
    const source = ['button 1', 'button 2'];
    const result = transformer.transformQuickReplies(source);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      content_type: 'text',
      title: 'button 1',
      payload: 'button 1',
    });
    expect(result[1]).toEqual({
      content_type: 'text',
      title: 'button 2',
      payload: 'button 2',
    });
  });

  it('Should test transform quick reply. Should fail because of too long title. transformQuickReplies', () => {
    const source = [
      'button 1 text too long. button 1 text too long. button 1 text too long. button 1 text too long. button 1 text too long. button 1 text too long. button 1 text too long. button 1 text too long. button 1 text too long. longer than 50 symbols',
      'button 2',
    ];
    const result = transformer.transformQuickReplies(source);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      content_type: 'text',
      title: 'button 2',
      payload: 'button 2',
    });
  });

  it('Should test transform buttons - empty. transformButtons', () => {
    const messageText = 'dummy message';
    const source = [];
    const result = transformer.transformButtons(source, messageText);
    expect(result.attachment).toBe(null);
    expect(result.quick_replies).toBe(null);
  });

  it('Should test transform buttons - only buttons. transformButtons', () => {
    const messageText = 'dummy message';
    const source = [
      {
        type: 'unknown',
        title: '+000000',
        payload: '+000000',
      },
      {
        type: 'phone_number',
        title: '+000000',
        payload: '+000000',
      },
      {
        type: 'postback',
        title: 'node_1',
        payload: 'feedback',
      },
      {
        type: 'web_url',
        title: 'IBM',
        url: 'http://www.ibm.com',
      },
    ];
    const result = transformer.transformButtons(source, messageText);
    expect(result.attachment).not.toBe(null);
    expect(result.quick_replies).toBe(null);
    const buttonsResult = source.splice(1);
    expect(result.attachment).toEqual({
      type: 'template',
      payload: {
        template_type: 'button',
        text: messageText,
        buttons: buttonsResult,
      },
    });
  });

  it('Should test transform buttons - only quick_replies. transformButtons', () => {
    const messageText = 'dummy message';
    const source = [
      {
        title: 'text 1',
        payload: 'text 1',
        image_url: 'http://image',
      },
      {
        type: 'text',
        title: 'text 1',
        payload: 'text 1',
        image_url: undefined,
      },
      {
        type: 'location',
        title: 'location 1',
        payload: 'location 1',
      },
      {
        type: 'user_email',
        title: 'user_email 1',
        payload: 'user_email 1',
      },
      {
        type: 'user_phone_number',
        title: 'user_phone_number 1',
        payload: 'user_phone_number 1',
      },
    ];
    const resultQuickReplies = [
      {
        content_type: 'text',
        title: 'text 1',
        payload: 'text 1',
        image_url: 'http://image',
      },
      {
        content_type: 'text',
        title: 'text 1',
        payload: 'text 1',
      },
      {
        content_type: 'location',
        title: 'location 1',
        payload: 'location 1',
      },
      {
        content_type: 'user_email',
        title: 'user_email 1',
        payload: 'user_email 1',
      },
      {
        content_type: 'user_phone_number',
        title: 'user_phone_number 1',
        payload: 'user_phone_number 1',
      },
    ];
    const result = transformer.transformButtons(source, messageText);
    expect(result.attachment).toBe(null);
    expect(result.quick_replies).not.toBe(null);
    expect(result.quick_replies).toEqual(resultQuickReplies);
  });

  it('Should test transform buttons - buttons & quick replies. transformButtons', () => {
    const messageText = 'dummy message';
    const source = [
      {
        type: 'phone_number',
        title: '+000000',
        payload: '+000000',
      },
      {
        type: 'text',
        title: 'text 1',
        payload: 'text 1',
      },
    ];
    const result = transformer.transformButtons(source, messageText);
    expect(result.attachment).not.toBe(null);
    expect(result.quick_replies).not.toBe(null);
    const buttonsResult = [source[0]];
    expect(result.attachment).toEqual({
      type: 'template',
      payload: {
        template_type: 'button',
        text: messageText,
        buttons: buttonsResult,
      },
    });
    expect(result.quick_replies).toHaveLength(1);
    expect(result.quick_replies[0]).toEqual({
      content_type: 'text',
      title: 'text 1',
      payload: 'text 1',
    });
  });

  it('Should test transform buttons - quick_replies without title. transformButtons', () => {
    const messageText = 'dummy message';
    const source = [
      {
        type: 'text',
        title: '',
        payload: 'text 1',
        image_url: 'http://image',
      },
      {
        type: 'text',
        title: 'text 1',
        payload: 'text 1',
      },
    ];
    const result = transformer.transformButtons(source, messageText);
    expect(result.attachment).toBe(null);
    expect(result.quick_replies).not.toBe(null);
    expect(result.quick_replies).toHaveLength(2);
    expect(result.quick_replies[0]).toEqual({
      content_type: 'text',
      title: '',
      payload: 'text 1',
      image_url: 'http://image',
    });
    expect(result.quick_replies[1]).toEqual({
      content_type: 'text',
      title: 'text 1',
      payload: 'text 1',
    });
  });

  it('Should test transform buttons - quick_replies without title and image url (skip invalid). transformButtons', () => {
    const messageText = 'dummy message';
    const source = [
      {
        content_type: 'text',
        title: '',
        payload: 'text 1',
      },
      {
        content_type: 'text',
        title: 'text 1',
        payload: 'text 1',
      },
    ];
    const result = transformer.transformButtons(source, messageText);
    expect(result.attachment).toBe(null);
    expect(result.quick_replies).not.toBe(null);
    expect(result.quick_replies).toHaveLength(1);
    expect(result.quick_replies[0]).toEqual({
      content_type: 'text',
      title: 'text 1',
      payload: 'text 1',
    });
  });

  it('Should test transform buttons - quick_replies without payload. transformButtons', () => {
    const messageText = 'dummy message';
    const source = [
      {
        type: 'text',
        title: 'text 1',
        payload: '',
        image_url: 'http://image',
      },
      {
        type: 'text',
        title: 'text 1',
        payload: 'text 1',
      },
    ];
    const result = transformer.transformButtons(source, messageText);
    expect(result.attachment).toBe(null);
    expect(result.quick_replies).not.toBe(null);
    expect(result.quick_replies).toHaveLength(2);
    expect(result.quick_replies[0]).toEqual({
      content_type: 'text',
      title: 'text 1',
      payload: '',
      image_url: 'http://image',
    });
    expect(result.quick_replies[1]).toEqual({
      content_type: 'text',
      title: 'text 1',
      payload: 'text 1',
    });
  });

  it('Should test transform buttons - quick_replies without payload and image url (skip invalid). transformButtons', () => {
    const messageText = 'dummy message';
    const source = [
      {
        content_type: 'text',
        title: 'text 1',
        payload: '',
      },
      {
        content_type: 'text',
        title: 'text 1',
        payload: 'text 1',
      },
    ];
    const result = transformer.transformButtons(source, messageText);
    expect(result.attachment).toBe(null);
    expect(result.quick_replies).not.toBe(null);
    expect(result.quick_replies).toHaveLength(1);
    expect(result.quick_replies[0]).toEqual({
      content_type: 'text',
      title: 'text 1',
      payload: 'text 1',
    });
  });

  it('Should test transform buttons - invalid title. transformButtons', () => {
    const messageText = 'dummy message';
    const source = [
      {
        type: 'unknown',
        title:
          'Longer than 50 symbols xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx',
        payload: '+000000',
      },
      {
        type: 'phone_number',
        title:
          'Longer than 50 symbols xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx',
        payload: '+000000',
      },
      {
        type: 'postback',
        title:
          'Longer than 50 symbols xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxx',
        payload: 'feedback',
      },
      {
        type: 'web_url',
        title: 'IBM',
        url: 'http://www.ibm.com',
      },
    ];
    const result = transformer.transformButtons(source, messageText);
    expect(result.attachment).not.toBe(null);
    expect(result.quick_replies).toBe(null);
    const buttonsResult = [source[3]];
    expect(result.attachment).toEqual({
      type: 'template',
      payload: {
        template_type: 'button',
        text: messageText,
        buttons: buttonsResult,
      },
    });
  });
});
