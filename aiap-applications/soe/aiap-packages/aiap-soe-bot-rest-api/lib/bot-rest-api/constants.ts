/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const BASE_URL = '/api/v1/conversations/conversations';
const UPDATE_MESSAGE_PATH = BASE_URL + '/messages';
const GET_MESSAGE_PATH = BASE_URL + '/:conversationId/messages';
const TYPING_EVENT_PATH = BASE_URL + '/:conversationId/events/typing';
const PING_PONG_PATH = BASE_URL + '/pingpong';

const CHAT_API_BOT_TYPE = 'chatapibot';

const PING_PONG_PREFIX = 'PING_PONG_EVENT_';
const MESSAGE_STACK_PREFIX = 'MESSAGES_STACK_';
const AGENT_TYPING_PREFIX = 'AGENT_TYPING_';
const DEFAULT_CHANNEL = 'ACA-CHAT-API';


const CONSTANTS = {
  BASE_URL,
  UPDATE_MESSAGE_PATH,
  GET_MESSAGE_PATH,
  TYPING_EVENT_PATH,
  PING_PONG_PATH,
  CHAT_API_BOT_TYPE,
  PING_PONG_PREFIX,
  MESSAGE_STACK_PREFIX,
  AGENT_TYPING_PREFIX,
  DEFAULT_CHANNEL,
};

export {
  CONSTANTS,
}
