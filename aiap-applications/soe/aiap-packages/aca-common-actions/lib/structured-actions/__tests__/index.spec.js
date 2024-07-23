/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
jest.unmock('../index');

jest.mock('@ibm-aca/aca-common-logger', () => jest.requireActual('@ibm-aca/aca-common-logger').mock);
jest.mock('../processor', () => ({
  processContent: () => {
    return [{ title: 'test1but', type: 'postback' }, { title: 'test2but', type: 'postback' }];
  },
}));

describe('structured-actions tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should add attachments to message', async () => {
    const index = require('../index');
    const sendMessageMock = jest.fn();
    const addAttachmentMock = jest.fn();
    const addTextMock = jest.fn();
    const createOutgoingMessageForMock = jest.fn().mockImplementation(() => ({
      recipient: { id: 'first_answer' },
      addAttachment: addAttachmentMock,
      addText: addTextMock,
      message: {},
    }));
    const params = {
      before: 'message before ',
      after: ' message after',
      update: {
        message: {
          text: 'question',
        },
        sender: {
          id: 5555,
        },
      },
      bot: {
        sendMessage: sendMessageMock,
        createOutgoingMessageFor: createOutgoingMessageForMock,
      },
      tree: [
        {
          tag: 'buttons',
          content: [[Object], [Object]],
        },
      ],
    };

    await index.buttons().controller(params);
    const expectedAttachment = {
      type: 'buttons',
      attributes: [],
      attachments: [{ title: 'test1but', type: 'postback' }, { title: 'test2but', type: 'postback' }],
    };
    const expected = {
      recipient: { id: 'first_answer' },
      addAttachment: addAttachmentMock,
      addText: addTextMock,
      message: {},
    };
    expect(createOutgoingMessageForMock).toHaveBeenCalledWith(params.update.sender.id);
    expect(addAttachmentMock).toHaveBeenCalledWith(expectedAttachment);
    expect(sendMessageMock).toHaveBeenCalledWith(expected);
  });
});
