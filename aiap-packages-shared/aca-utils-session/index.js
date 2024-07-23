/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-utils-session';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { v4: uuidv4 } = require('uuid');

const { getTokenService } = require('@ibm-aiap/aiap-token-service');
const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');
const { getConfiguration } = require('@ibm-aiap/aiap-env-configuration-service');

const {
  getToken,
  getTokenDecoded
} = require('@ibm-aca/aca-utils-socket');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');


const CONFIG = getConfiguration();
const DATA_STORE = getMemoryStore();

const newConversationId = () => {
  const RET_VAL = uuidv4();
  return RET_VAL;
};

const _getHandShakeQuery = (socket) => {
  const RET_VAL = ramda.path(['handshake', 'query'], socket);
  return RET_VAL;
}

const getParamsFromSocket = (socket) => {
  const HANDSHAKE_QUERY = _getHandShakeQuery(socket);
  const HANDSHAKE_HEADER_COOKIE = ramda.path(['handshake', 'headers', 'cookie'], socket);
  const RET_VAL = {
    general: {
      userAgent: ramda.path(['userAgent'], HANDSHAKE_QUERY),
      language: ramda.path(['language'], HANDSHAKE_QUERY),
      screenResolution: ramda.path(['screenResolution'], HANDSHAKE_QUERY),
      visitorName: ramda.path(['visitorName'], HANDSHAKE_QUERY),
    },
    inContact: {
      token: ramda.path(['langtokenuage'], HANDSHAKE_QUERY),
      skill: ramda.path(['skill'], HANDSHAKE_QUERY),
      poc: ramda.path(['poc'], HANDSHAKE_QUERY),
    },
    cookie: HANDSHAKE_HEADER_COOKIE,
  };
  return RET_VAL;
};

const getGAcaProps = (socket) => {
  const HANDSHAKE_QUERY = _getHandShakeQuery(socket);
  const G_ACA_PROPS_STRING = ramda.path(['gAcaProps'], HANDSHAKE_QUERY);
  let retVal;
  try {
    retVal = JSON.parse(G_ACA_PROPS_STRING);
  } catch (error) {
    const ACA_ERROR = {
      type: 'G_ACA_PROPS_RETRIEVAL_ERROR',
      message: `[${MODULE_ID}] Unable retrieve gAcaProps from socket query!`,
      error: error
    }
    logger.error('->', { ACA_ERROR });
  }
  return retVal;
}

const getSessionFromToken = (token) => {
  let retVal;
  if (
    !lodash.isEmpty(token)
  ) {
    const TOKEN_SERVICE = getTokenService();
    const TOKEN_DECODED = TOKEN_SERVICE.verify(token);
    const CONVERSATION_ID = ramda.path(['conversation', 'id'], TOKEN_DECODED);
    const USER_ID = ramda.path(['user', 'id'], TOKEN_DECODED);
    const TENANT_ID = ramda.path(['tenant', 'id'], TOKEN_DECODED);
    const TENANT_HASH = ramda.path(['tenant', 'hash'], TOKEN_DECODED);

    const CHANNEL_ID = ramda.path(['channel', 'id'], TOKEN_DECODED);

    retVal = {
      token: {
        value: token,
        decoded: TOKEN_DECODED
      },
      tenant: {
        id: TENANT_ID,
        hash: TENANT_HASH,
      },
      conversation: {
        id: CONVERSATION_ID,
      },
      channel: {
        id: CHANNEL_ID,
      },
      user: {
        id: USER_ID
      }
    }
  }
  return retVal;
}

const getSessionFromSocket = (socket) => {
  const TOKEN = getToken(socket);
  const TOKEN_DECODED = getTokenDecoded(socket);
  console.log('getSessionFromSocket', { TOKEN_DECODED });
  const SOCKET_PARAMS = getParamsFromSocket(socket);
  const G_ACA_PROPS = getGAcaProps(socket);

  const CONVERSATION_ID = ramda.pathOr(newConversationId(), ['conversation', 'id'], TOKEN_DECODED)

  let session = getSessionFromToken(TOKEN);
  if (
    lodash.isEmpty(session)
  ) {

    // Possibly throw an error would be logical!!!!

    session = {
      token: {
        value: TOKEN,
        decoded: TOKEN_DECODED
      },
      socket: {
        id: socket.id,
        params: SOCKET_PARAMS,
      },
      conversation: {
        id: CONVERSATION_ID,
      },
    }
  }
  session.gAcaProps = G_ACA_PROPS;
  return session;
}

const userSessionId = id => {
  return 'user_sess:' + id;
};

const convSessionId = id => {
  return 'conv_sess:' + id;
};

const retrieveStoredSessionByUserId = async id => {
  const ITEM_ID = userSessionId(id);
  const RET_VAL = await DATA_STORE.get(ITEM_ID);
  return RET_VAL;
};

const retrieveStoredSessionByConvId = async id => {
  const ITEM_ID = convSessionId(id);
  const RET_VAL = await DATA_STORE.get(ITEM_ID);
  return RET_VAL;
};

const retrieveStoredSession = async (params) => {
  const USER_ID = params?.user?.id;
  const CONV_ID = params?.conversation?.id;
  let retVal = undefined;
  if (
    !lodash.isEmpty(USER_ID)
  ) {
    retVal = await retrieveStoredSessionByUserId(USER_ID);
  } else if (CONV_ID && !lodash.isEmpty(CONV_ID)) {
    retVal = await retrieveStoredSessionByConvId(CONV_ID);
  } else {
    logger.info(`[WARN] retrieveStoredSession | Properties: CONV_ID: ${CONV_ID}, USER_ID: ${USER_ID} are empty!`);
  }

  return retVal;
};

const reloadChatServerSessionProviderSession = async (provider) => {
  if (
    !lodash.isEmpty(provider?.session)
  ) {
    provider.session = await retrieveStoredSession(provider?.session);
  }
}

const storeId = (session) => {
  const USER_ID = session?.user?.id;
  const CONV_ID = session?.conversation?.id;
  let retVal = undefined;
  if (USER_ID && !lodash.isEmpty(USER_ID)) {
    retVal = userSessionId(USER_ID);
  } else {
    retVal = convSessionId(CONV_ID);
  }
  return retVal;
};

const storeSession = async session => {
  const EXPIRATION = CONFIG.app.sessionDeleteTimeout;
  const STORE_ID = storeId(session);
  await DATA_STORE.set(STORE_ID, session, EXPIRATION);
};

const deleteSession = async session => {
  const STORE_ID = storeId(session);
  logger.info('deleteSession', { STORE_ID });
  await DATA_STORE.remove(STORE_ID);
};

const retrieveUserId = (session) => {
  const USER_ID = session?.user?.id;
  return USER_ID
}

const retrieveConvId = (session) => {
  const CONV_ID = session?.conversation?.id;
  return CONV_ID
}

const retrieveRoomId = session => {
  const USER_ID = retrieveUserId(session);
  const CONV_ID = retrieveConvId(session);
  if (!lodash.isEmpty(USER_ID)) {
    return `user_room:${USER_ID}`;
  } else {
    return `conv_room:${CONV_ID}`;
  }
};


const setParamToSession = async (provider, path, value) => {
  const RUN_TIME_SESSION = ramda.pathOr(undefined, ['session'], provider);
  const STORED_SESSION = await retrieveStoredSession(RUN_TIME_SESSION);
  if (STORED_SESSION && path && !lodash.isEmpty(path) && lodash.isArray(path)) {
    const UPDATED_SESSION = ramda.assocPath(path, value, STORED_SESSION);
    provider.session = UPDATED_SESSION;
    await storeSession(provider.session);
  }
};


const collectTokenContent = (session) => {
  const USER = ramda.path(['user'], session);
  const CONVERSATION = ramda.path(['conversation'], session);
  const TENANT = ramda.path(['tenant'], session);
  const CHANNEL = ramda.path(['channel'], session);
  const RET_VAL = {
    tenant: TENANT,
    conversation: CONVERSATION,
    user: USER,
    channel: CHANNEL,
  };
  return RET_VAL;
}

const refreshToken = (params) => {
  try {
    const SESSION = ramda.path(['session'], params);
    const SESSION_TOKEN = ramda.path(['token'], SESSION);
    if (
      lodash.isEmpty(SESSION)
    ) {
      const MESSAGE = 'Missing required params.session parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(SESSION_TOKEN)
    ) {
      SESSION.token = {};
    }
    const TOKEN_DECODED = collectTokenContent(SESSION);
    const TOKEN_SERVICE = getTokenService();
    const TOKEN_ENCODED = TOKEN_SERVICE.sign(TOKEN_DECODED);
    SESSION.token.value = TOKEN_ENCODED;
    SESSION.token.decoded = TOKEN_DECODED;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('refreshToken', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const isSessionValid = async (session) => {
  const STORED_SESSION = await retrieveStoredSession(session);
  if (!lodash.isEmpty(STORED_SESSION)) {
    return true;
  } else {
    return false;
  }
}

const isSessionExpired = async (params) => {
  const STORED_SESSION = await retrieveStoredSession(params?.session);
  const STORED_SESSION_EXPIRATION_TIME = STORED_SESSION?.expirationTime;
  const MESSAGE_TIMESTAMP = params?.messageTimestamp;
  if (STORED_SESSION_EXPIRATION_TIME < MESSAGE_TIMESTAMP) {
    return true;
  } else {
    return false;
  }
}


module.exports = {
  getParamsFromSocket,
  getSessionFromToken,
  getSessionFromSocket,
  retrieveStoredSession,
  reloadChatServerSessionProviderSession,
  storeSession,
  deleteSession,
  retrieveRoomId,
  setParamToSession,
  newConversationId,
  collectTokenContent,
  refreshToken,
  isSessionValid,
  isSessionExpired
}
