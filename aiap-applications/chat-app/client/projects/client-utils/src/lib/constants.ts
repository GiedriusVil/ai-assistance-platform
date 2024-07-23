/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export const LANG = {
  EN: 'en'
};

export const FEEDBACK = {
  NEGATIVE: -1,
  POSITIVE: 1
};

export const FEEDBACK_DEFAULT = {
  SCORE: 'feedback.modal-default-reason',
  COMMENT: 'feedback.modal-default-comment'
};

export const CHAT_WINDOW_STATE = {
  MINIMIZE: {
    TITLE: 'header.icon-minimize-title',
    ALT: 'header.icon-minimize-alt'
  },
  RESTORE: {
    TITLE: 'header.icon-maximize-title',
    ALT: 'header.icon-maximize-alt'
  }
};

export enum PRODUCT_EVENT_TYPE {
  PRODUCT_SELECT = 'productSelect',
  PRODUCT_REMOVE = 'productRemove',
  INCREASE_QUANTITY = 'increaseQuantity',
  REDUCE_QUANTITY = 'reduceQuantity'
}

export const LIVE_CHAT_TYPE = {
  AGENT: 'agent',
  BOT: 'bot',
  USER: 'user',
  NOTIFICATION: 'notification',
  TYPING: 'typing'
};

export const Z_CHAT_EVENT_TYPE = {
  MSG: 'chat.msg',
  QUEUE_POSITION: 'chat.queue_position',
  MEMBER_JOIN: 'chat.memberjoin',
  TYPING: 'typing',
  MEMBER_LEAVE: 'chat.memberleave'
};

export const Z_CHAT_ACCOUNT_STATUS = {
  ONLINE: 'online',
  AWAY: 'away',
  OFFLINE: 'offline'
};

export const Z_CHAT_CONNECTION_STATUS = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  CLOSED: 'closed'
};

export enum WINDOW_EVENT_TYPES {
  OPEN_CHAT_CLIENT = 'aiapChatAppClientOpen',
  OPEN_CHAT_PREVIEW_MODE_OPEN = 'aiapChatWindowPreviewOpen',
  OPEN_CHAT_PREVIEW_MODE_CLOSE = 'aiapChatPreviewWidowClose',
}
