/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getConfiguration } = require('@ibm-aiap/aiap-env-configuration-service');
const { retrieveRoomId } = require('@ibm-aca/aca-utils-session');

const { getMemoryStore } = require('@ibm-aiap/aiap-memory-store-provider');
const config = getConfiguration();
const DATA_STORE = getMemoryStore();
const { OUTGOING_MESSAGE_TYPE } = require('./utils');

const transcriptId = (session) => {
  const ROOM_ID = retrieveRoomId(session);
  const RET_VAL = `transcript:${ROOM_ID}`;
  return RET_VAL;
};

const _retrieveTranscript = async (id) => {
  if (ramda.isEmpty(id)) {
    throw new Error('Please provide transcript id!');
  }
  const RET_VAL = await DATA_STORE.get(id);
  return RET_VAL;
}

const retrieveTranscript = async (session) => {
  const TRANSCRIPT_ID = transcriptId(session);
  const STORED_TRANSCRIPT = await _retrieveTranscript(TRANSCRIPT_ID);
  let RET_VAL = [];
  if (STORED_TRANSCRIPT && STORED_TRANSCRIPT.messages && STORED_TRANSCRIPT.messages.length) {
    for (let item of STORED_TRANSCRIPT.messages) {
      if (item && item.message && (item.message.text || item.message.attachment)) {
        RET_VAL.push({
          attachment: item.message.attachment,
          isWbc: item.message?.isWbc,
          feedback: item.message.feedback,
          text: item.message.text,
          type: getType(item),
          timestamp: item.message.timestamp,
          sender_action: item.sender_action,
          traceId: item.traceId,
        });
      }
    }
  }
  return RET_VAL;
};

const retrieveLeftPanelState = async (session) => {
  const TRANSCRIPT_ID = transcriptId(session);
  const STORED_TRANSCRIPT = await _retrieveTranscript(TRANSCRIPT_ID);
  const RET_VAL = reduceTranscriptToLeftPanelState(STORED_TRANSCRIPT);
  return RET_VAL;
}

const mergeChangesToLeftPanel = (leftPanel, changes) => {
  const LAYOUT = {};
  leftPanel.forEach((element, index) => {
    LAYOUT[index + 1] = {
      existing: element,
      new: [],
    }
  })

  changes?.components?.forEach(element => {
    if (!LAYOUT[element.position]) {
      LAYOUT[element.position] = { new: [] };
    }
    LAYOUT[element.position].new.push(element);
    delete element.position;
  });

  const NEW_COMPONENT_ARRAY = [];
  Object.keys(LAYOUT).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
    if (LAYOUT[key].new) {
      NEW_COMPONENT_ARRAY.push(...LAYOUT[key].new)
    }
    if (LAYOUT[key].existing) {
      NEW_COMPONENT_ARRAY.push(LAYOUT[key].existing)
    }
  })

  return NEW_COMPONENT_ARRAY;
}

const reduceTranscriptToLeftPanelState = (transcript) => {
  let leftPanel = [];
  if (lodash.isEmpty(transcript?.messages)) {
    return leftPanel;
  }

  leftPanel = transcript?.messages[0]?.engagement?.chatApp?.leftPanel?.layout

  let leftPanelChanges = transcript.messages.filter((message) => message?.message?.leftPanel).map((message) => message.message.leftPanel);

  let stateFrom = 0;
  for (let index = leftPanelChanges.length - 1; index >= 0; --index) {
    if (leftPanelChanges[index].clear) {
      stateFrom = index;
      leftPanel = [];
      break;
    }
  }

  leftPanelChanges = leftPanelChanges.slice(stateFrom);

  leftPanelChanges.forEach((change) => {
    leftPanel = mergeChangesToLeftPanel(leftPanel, change);
  })
  return leftPanel;
}

const getType = item => {
  let foundType = item.type;
  if (!foundType) {
    foundType = item.recipient ? 'bot' : 'user';
  }
  return foundType;
};

const createTranscript = async session => {
  const TRANSCRIPT_ID = transcriptId(session);
  const TRANSCRIPT = {
    messages: [],
  };
  await storeTranscript(TRANSCRIPT_ID, TRANSCRIPT);
};

const addMessageToTranscript = async (session, message) => {
  const TRANSCRIPT_ID = transcriptId(session);
  let transcript = await DATA_STORE.get(TRANSCRIPT_ID);
  addTimestamp(message);

  if (!transcript) {
    transcript = {
      messages: [message],
    };
  } else if (!transcript.messages) {
    transcript.messages = [message];
  } else {
    transcript.messages.push(message);
  }
  await storeTranscript(TRANSCRIPT_ID, transcript);
};

/** Store changed by reference transcript */
const storeTranscript = async (id, transcript) => {
  const TRANSCRIPT_EXPIRATION = config.app.transcriptDeleteTimeout;
  await DATA_STORE.set(id, transcript, TRANSCRIPT_EXPIRATION);
}

const isMessageInTranscript = async (session, message) => {
  let retVal = false;
  const TRANSCRIPT_ID = transcriptId(session);
  const TRANSCRIPT = await DATA_STORE.get(TRANSCRIPT_ID);
  const META_INDEX = ramda.pathOr(undefined, ['meta', 'index'], message);
  if (META_INDEX && TRANSCRIPT && TRANSCRIPT.messages) {
    let existingMessage = TRANSCRIPT.messages.find(tmpMessage => {
      let exists = false;
      const TMP_META_INDEX = ramda.pathOr(undefined, ['meta', 'index'], tmpMessage);
      if (TMP_META_INDEX && META_INDEX && TMP_META_INDEX === META_INDEX) {
        exists = true;
      }
      return exists;
    });
    if (existingMessage) {
      retVal = true;
    }
  }
  return retVal;
};

const retrieveMessageFromTranscript = (id, transcript) => {
  if (ramda.isNil(transcript)) {
    throw new Error('Please transcript!');
  }
  if (ramda.isEmpty(id)) {
    throw new Error('Missing messageId!');
  }

  let retVal;
  if (transcript.messages) {
    retVal = transcript.messages.find(item => {
      const TRANSCRIPT_MESSAGE_ID = ramda.path(['traceId', 'messageId'], item);
      return id === TRANSCRIPT_MESSAGE_ID && item.sender_action !== OUTGOING_MESSAGE_TYPE.TYPING_ON;
    });
  }
  return retVal;
}

const addAttachmentToTranscript = async (session, messageId, attachment) => {
  if (ramda.isNil(session)) {
    throw new Error('Please provide session!');
  }
  if (ramda.isNil(attachment)) {
    throw new Error('Please provide session!');
  }
  if (ramda.isEmpty(messageId)) {
    throw new Error('Missing messageId!');
  }

  const TRANSCRIPT_ID = transcriptId(session);
  const STORED_TRANSCRIPT = await _retrieveTranscript(TRANSCRIPT_ID);
  const MESSAGE = retrieveMessageFromTranscript(messageId, STORED_TRANSCRIPT);
  if (!ramda.isNil(MESSAGE)) {
    MESSAGE.message.feedback = attachment;
    await storeTranscript(TRANSCRIPT_ID, STORED_TRANSCRIPT);
  }
}

const addTimestamp = message => {
  if (ramda.pathOr(undefined, ['message'], message)) {
    message.message.timestamp = ramda.pathOr(new Date().getTime(), ['message', 'timestamp'], message);
  }
}

module.exports = {
  retrieveTranscript,
  createTranscript,
  addMessageToTranscript,
  isMessageInTranscript,
  addAttachmentToTranscript,
  retrieveLeftPanelState,
};
