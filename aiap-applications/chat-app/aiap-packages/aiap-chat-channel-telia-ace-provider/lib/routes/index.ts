/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const ROUTES = express.Router();

import { ChatV1Controller } from '../controllers';

const ROUTES_CHAT_V1_BASE_PATH = '/chat/v1';

ROUTES.delete(`${ROUTES_CHAT_V1_BASE_PATH}/:conversationIdExternal`, ChatV1Controller.handleRequestFinished);
ROUTES.post(`${ROUTES_CHAT_V1_BASE_PATH}/:conversationIdExternal/entries`, ChatV1Controller.handleRequestEntries);
ROUTES.put(`${ROUTES_CHAT_V1_BASE_PATH}/:conversationIdExternal/established`, ChatV1Controller.handleRequestEstablished);
ROUTES.put(`${ROUTES_CHAT_V1_BASE_PATH}/:conversationIdExternal/queue`, ChatV1Controller.handleRequestQueue);
ROUTES.put(`${ROUTES_CHAT_V1_BASE_PATH}/:conversationIdExternal/typing-indicator`, ChatV1Controller.handleRequestTypingIndicator);

export {
  ROUTES,
};
