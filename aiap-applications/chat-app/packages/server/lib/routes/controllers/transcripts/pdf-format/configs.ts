/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const HEADER: any = {
  DATE: 'Date: ',
  USER_NAME: 'Username: ',
  EMAIL: 'E-mail: ',
  DELIMITER: '    /    ',
  TITLE: 'Conversation with the '
};

const DATE: any = {
  LOCALES: 'en-US',
  OPTIONS: { month: 'long', day: 'numeric' }
};

const MESSAGE_TYPES: any = {
  BOT: 'bot',
  USER: 'user',
  DEFAULT: 'sender'
};

const HTML_TAGS: any = {
  HYPERLINK: 'a',
  HEADER: 'th',
  SCOPE: 'col'
};

export {
  HEADER,
  DATE,
  MESSAGE_TYPES,
  HTML_TAGS,
};
