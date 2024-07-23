/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
jest.mock('@ibm-aca/aca-common-logger', () => jest.requireActual('@ibm-aca/aca-common-logger').mock);

const transformButtonsMock = jest.fn();
const transformQuickReplies = jest.fn();
const mockTransformer = {
  transformButtons: transformButtonsMock,
  transformQuickReplies: transformQuickReplies,
};
jest.mock('../transformer', () => mockTransformer);
const addAttachmentMock = jest.fn();
const addTextMock = jest.fn();
const addQuickRepliesMock = jest.fn();
const outgoingMessageMock = {
  addAttachment: addAttachmentMock,
  addQuickReplies: addQuickRepliesMock,
  addText: addTextMock,
};
const createOutgoingMessageForMock = jest.fn();
const sendMessageMock = jest.fn();
const bot = {
  createOutgoingMessageFor: createOutgoingMessageForMock,
  sendMessage: sendMessageMock,
};
const before = 'some sample text which goes before buttons';

const senderId = 'sender Id 1';
const update = {
  sender: {
    id: senderId,
  },
};

const socketButtonsAction = require('../socketio-buttons');

describe('Socketio Buttons Action', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    createOutgoingMessageForMock.mockReturnValue(outgoingMessageMock);
  });

  it('Should test Socket Buttons action - no buttons and quick replies', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: [],
      },
    ];

    controller({ bot, tree, update, before });

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock).toHaveBeenCalledTimes(0);
  });
  it('Should test Socket Buttons action - no buttons tag', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons_unknown',
        content: [],
      },
    ];

    controller({ bot, tree, update, before });

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock).toHaveBeenCalledTimes(0);
  });
  it('Should test Socket Buttons action - no valid value', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: [10],
      },
    ];

    controller({ bot, tree, update, before });

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock).toHaveBeenCalledTimes(0);
  });
  it('Should test Socket Buttons action - fail because of both buttons and quick replies exist in tag', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: [
          'Option 1',
          {
            content: ['Button 1'],
            attrs: {
              type: 'postback',
              title: 'node_1',
            },
          },
        ],
      },
    ];

    controller({ bot, tree, update, before });

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(0);
  });
  it('Should test Socket Buttons action - create buttons', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: [
          {
            content: ['Button 1'],
            attrs: {
              type: 'postback',
              title: 'node_1',
            },
          },
          {
            content: ['Button 2'],
            attrs: {
              type: 'postback',
              title: 'node_2',
            },
          },
        ],
      },
    ];

    const buttonsTransformed = {
      type: 'template',
      payload: {
        template_type: 'button',
        text: before,
        buttons: [
          {
            content_type: 'postback',
            title: 'node_1',
            payload: 'Button 1',
          },
          {
            content_type: 'postback',
            title: 'node_2',
            payload: 'Button 2',
          },
        ],
      },
    };

    transformButtonsMock.mockReturnValueOnce({ attachment: buttonsTransformed });

    controller({ bot, tree, update, before });

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(createOutgoingMessageForMock).toHaveBeenCalledWith(update.sender.id);

    expect(transformButtonsMock).toHaveBeenCalledTimes(1);
    expect(transformButtonsMock).toHaveBeenCalledWith(
      [
        {
          type: 'postback',
          title: 'node_1',
          payload: 'Button 1',
        },
        {
          type: 'postback',
          title: 'node_2',
          payload: 'Button 2',
        },
      ],
      before
    );

    expect(addAttachmentMock).toHaveBeenCalledTimes(1);
    expect(addAttachmentMock).toHaveBeenCalledWith(buttonsTransformed);

    expect(sendMessageMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock).toHaveBeenCalledWith(outgoingMessageMock);

    expect(transformQuickReplies).toHaveBeenCalledTimes(0);
    expect(addTextMock).toHaveBeenCalledTimes(0);
    expect(addQuickRepliesMock).toHaveBeenCalledTimes(0);
  });
  it('Should test Socket Buttons action - fail because buttons and quick_replies both created', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: [
          {
            content: ['Option 1'],
            attrs: {
              type: 'text',
              title: 'Option 1',
            },
          },
          {
            content: ['Button 1'],
            attrs: {
              type: 'postback',
              title: 'node_1',
            },
          },
        ],
      },
    ];

    const quickRepliesTransformed = [
      {
        content_type: 'text',
        title: 'Option 1',
        payload: 'Option 1',
      },
    ];

    const buttonsTransformed = {
      type: 'template',
      payload: {
        template_type: 'button',
        text: before,
        buttons: [
          {
            content_type: 'postback',
            title: 'node_1',
            payload: 'Button 1',
          },
        ],
      },
    };

    transformButtonsMock.mockReturnValueOnce({
      attachment: buttonsTransformed,
      quick_replies: quickRepliesTransformed,
    });

    controller({ bot, tree, update, before });

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(createOutgoingMessageForMock).toHaveBeenCalledWith(update.sender.id);

    expect(transformButtonsMock).toHaveBeenCalledTimes(1);
    expect(transformButtonsMock).toHaveBeenCalledWith(
      [
        {
          type: 'text',
          title: 'Option 1',
          payload: 'Option 1',
        },
        {
          type: 'postback',
          title: 'node_1',
          payload: 'Button 1',
        },
      ],
      before
    );

    expect(addAttachmentMock).toHaveBeenCalledTimes(0);
    expect(sendMessageMock).toHaveBeenCalledTimes(0);
    expect(transformQuickReplies).toHaveBeenCalledTimes(0);
    expect(addTextMock).toHaveBeenCalledTimes(0);
    expect(addQuickRepliesMock).toHaveBeenCalledTimes(0);
  });
  it('Should test Socket Buttons action - no buttons and quick_replies created', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: [
          {
            content: ['Option 1'],
            attrs: {
              type: 'text',
              title: 'Option 1',
            },
          },
          {
            content: ['Button 1'],
            attrs: {
              type: 'postback',
              title: 'node_1',
            },
          },
        ],
      },
    ];

    transformButtonsMock.mockReturnValueOnce({
      attachment: null,
      quick_replies: null,
    });

    controller({ bot, tree, update, before });

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(createOutgoingMessageForMock).toHaveBeenCalledWith(update.sender.id);

    expect(transformButtonsMock).toHaveBeenCalledTimes(1);
    expect(transformButtonsMock).toHaveBeenCalledWith(
      [
        {
          type: 'text',
          title: 'Option 1',
          payload: 'Option 1',
        },
        {
          type: 'postback',
          title: 'node_1',
          payload: 'Button 1',
        },
      ],
      before
    );

    expect(addAttachmentMock).toHaveBeenCalledTimes(0);
    expect(sendMessageMock).toHaveBeenCalledTimes(0);
    expect(transformQuickReplies).toHaveBeenCalledTimes(0);
    expect(addTextMock).toHaveBeenCalledTimes(0);
    expect(addQuickRepliesMock).toHaveBeenCalledTimes(0);
  });
  it('Should test Socket Buttons action - create quick_replies from buttons', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: [
          {
            content: ['Option 1'],
            attrs: {
              title: 'Option 1',
            },
          },
        ],
      },
    ];

    const quickRepliesTransformed = [
      {
        content_type: 'text',
        title: 'Option 1',
        payload: 'Option 1',
      },
    ];

    transformButtonsMock.mockReturnValueOnce({ quick_replies: quickRepliesTransformed });

    controller({ bot, tree, update, before });

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(createOutgoingMessageForMock).toHaveBeenCalledWith(update.sender.id);

    expect(transformButtonsMock).toHaveBeenCalledTimes(1);
    expect(transformButtonsMock).toHaveBeenCalledWith(
      [
        {
          title: 'Option 1',
          payload: 'Option 1',
        },
      ],
      before
    );

    expect(addAttachmentMock).toHaveBeenCalledTimes(0);
    expect(addQuickRepliesMock).toHaveBeenCalledTimes(1);
    expect(addQuickRepliesMock).toHaveBeenCalledWith(quickRepliesTransformed);
    expect(addTextMock).toHaveBeenCalledTimes(1);

    expect(sendMessageMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock).toHaveBeenCalledWith(outgoingMessageMock);
  });
  it('Should test Socket Buttons action - create quick replies', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: ['Option 1|Option 2||Option 4'],
      },
    ];

    const quickRepliesTransformed = [
      {
        content_type: 'text',
        title: 'Option 1',
        payload: 'Option 1',
      },
      {
        content_type: 'text',
        title: 'Option 2',
        payload: 'Option 2',
      },
      {
        content_type: 'text',
        title: 'Option 3',
        payload: 'Option 3',
      },
    ];
    transformQuickReplies.mockReturnValueOnce(quickRepliesTransformed);

    controller({ bot, tree, update, before });

    expect(transformButtonsMock).toHaveBeenCalledTimes(0);
    expect(addAttachmentMock).toHaveBeenCalledTimes(0);

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(createOutgoingMessageForMock).toHaveBeenCalledWith(update.sender.id);

    expect(transformQuickReplies).toHaveBeenCalledTimes(1);
    expect(transformQuickReplies).toHaveBeenCalledWith(['Option 1', 'Option 2', 'Option 4']);

    expect(addTextMock).toHaveBeenCalledTimes(1);
    expect(addTextMock).toHaveBeenCalledWith(before);

    expect(addQuickRepliesMock).toHaveBeenCalledTimes(1);
    expect(addQuickRepliesMock).toHaveBeenCalledWith(quickRepliesTransformed);

    expect(sendMessageMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock).toHaveBeenCalledWith(outgoingMessageMock);
  });
  it('Should test Socket Buttons action - create quick replies no before text', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: ['Option 1|Option 2||Option 4'],
      },
    ];

    const quickRepliesTransformed = [
      {
        content_type: 'text',
        title: 'Option 1',
        payload: 'Option 1',
      },
      {
        content_type: 'text',
        title: 'Option 2',
        payload: 'Option 2',
      },
      {
        content_type: 'text',
        title: 'Option 3',
        payload: 'Option 3',
      },
    ];
    transformQuickReplies.mockReturnValueOnce(quickRepliesTransformed);

    controller({ bot, tree, update, before: ' ' });

    expect(transformButtonsMock).toHaveBeenCalledTimes(0);
    expect(addAttachmentMock).toHaveBeenCalledTimes(0);

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(createOutgoingMessageForMock).toHaveBeenCalledWith(update.sender.id);

    expect(transformQuickReplies).toHaveBeenCalledTimes(1);
    expect(transformQuickReplies).toHaveBeenCalledWith(['Option 1', 'Option 2', 'Option 4']);

    expect(addTextMock).toHaveBeenCalledTimes(0);

    expect(addQuickRepliesMock).toHaveBeenCalledTimes(1);
    expect(addQuickRepliesMock).toHaveBeenCalledWith(quickRepliesTransformed);

    expect(sendMessageMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock).toHaveBeenCalledWith(outgoingMessageMock);
  });
  it('Should test Socket Buttons action - create quick replies no valid entries', () => {
    const { controller } = socketButtonsAction();

    const tree = [
      {
        tag: 'buttons',
        content: ['Option 1 title too long xxxxxxxxx|||Option 4 xxxxxxxxx xxxxxxxxxxxxxxx'],
      },
    ];

    const quickRepliesTransformed = [];
    transformQuickReplies.mockReturnValueOnce(quickRepliesTransformed);

    controller({ bot, tree, update, before });

    expect(transformButtonsMock).toHaveBeenCalledTimes(0);
    expect(addAttachmentMock).toHaveBeenCalledTimes(0);

    expect(createOutgoingMessageForMock).toHaveBeenCalledTimes(1);
    expect(createOutgoingMessageForMock).toHaveBeenCalledWith(update.sender.id);

    expect(transformQuickReplies).toHaveBeenCalledTimes(1);
    expect(transformQuickReplies).toHaveBeenCalledWith([
      'Option 1 title too long xxxxxxxxx',
      'Option 4 xxxxxxxxx xxxxxxxxxxxxxxx',
    ]);

    expect(addTextMock).toHaveBeenCalledTimes(0);

    expect(addQuickRepliesMock).toHaveBeenCalledTimes(0);

    expect(sendMessageMock).toHaveBeenCalledTimes(0);
  });
});
