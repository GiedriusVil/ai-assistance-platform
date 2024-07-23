/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-mongo-transcripts-find-one-by-conversation-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');


const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { formatResponse } = require('./format-response');
const { isValueTrue } = require('@ibm-aiap/aiap-utils-mongo');

const _messages = require('../../messages');
const _feedbacks = require('../../feedbacks');
const _utterances = require('../../utterances');
const _conversations = require('../../conversations');

const _retrieveMessages = async (datasource, context, params) => {
  try {
    const MESSAGES_QUERY = {
      conversationId: params.id,
      systemMessages: isValueTrue(ramda.pathOr(false, ['systemMessages'], params)),
      pagination: params?.pagination,
      sort: {
        field: 'created',
        direction: 'asc'
      },
      options: {
        allowDiskUse: true,
      }
    };
    const RET_VAL = await _messages.findManyByQuery(datasource, context, MESSAGES_QUERY);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveMessages.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveFeedbacks = async (datasource, context, params) => {
  try {
    const FEEDBACKS_QUERY = {
      conversationId: params.id,
      sort: {
        field: 'created',
        direction: 'asc'
      },
      options: {
        allowDiskUse: true,
      }
    };

    const RET_VAL = await _feedbacks.findManyByQuery(datasource, context, FEEDBACKS_QUERY);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveFeedbacks.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveUtterances = async (datasource, context, params) => {
  try {
    const UTTERANCIES_QUERY = {
      filter: {
        conversationId: params.id,
      },
      sort: {
        field: 'timestamp',
        direction: 'asc'
      },
      options: {
        allowDiskUse: true,
      }
    }

    const RET_VAL = await _utterances.findManyByQuery(datasource, context, UTTERANCIES_QUERY);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveUtterances.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveReviews = async (datasource, context, params) => {
  try {
    let retVal = [];
    const PARAMS = {
      id: params.id
    };
    const CONVERSATION = await _conversations.findOneById(datasource, context, PARAMS);
    const REVIEWS = CONVERSATION?.reviewed;
    if (!lodash.isEmpty(REVIEWS)) {
      retVal = lodash.orderBy(REVIEWS, ['reviewDate'], ['desc']);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveReviews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _retrieveTags = async (datasource, context, params) => {
  try {
    let retVal = [];
    const PARAMS = {
      id: params.id
    };
    const CONVERSATION = await _conversations.findOneById(datasource, context, PARAMS);
    const TAGS = CONVERSATION?.tags;
    if (!lodash.isEmpty(TAGS)) {
      retVal = lodash.orderBy(TAGS, ['updateDate'], ['desc']);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveReviews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const findOneByConversationId = async (datasource, context, params) => {
  let messages;
  let messagesTotal;
  let reviews;
  let tags;

  const RET_VAL = {};
  try {
    const PROMISES = [];
    const ID = ramda.path(['id'], params);
    const SHOW_SYSTEM_MESSAGES = isValueTrue(ramda.pathOr(false, ['systemMessages'], params));
    if (
      lodash.isEmpty(ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    PROMISES.push(_retrieveMessages(datasource, context, params));
    PROMISES.push(_retrieveFeedbacks(datasource, context, params));
    PROMISES.push(_retrieveUtterances(datasource, context, params));
    PROMISES.push(_retrieveReviews(datasource, context, params));
    PROMISES.push(_retrieveTags(datasource, context, params));

    const DATA = await Promise.all(PROMISES);
    messages = ramda.pathOr([], ['items'], DATA[0]);
    messagesTotal = ramda.pathOr([], ['total'], DATA[0]);
    reviews = DATA[3];
    tags = DATA[4];

    const FEEDBACKS = ramda.pathOr([], ['items'], DATA[1]);
    const UTTERANCES = ramda.pathOr([], ['items'], DATA[2]);

    FEEDBACKS.forEach(fb => {
      const MESSAGES_FOR_FEEDBACK = messages.filter(
        msg => (msg.utteranceId === fb.messageId || msg._id === fb.messageId) && msg.author === 'BOT'
      );
      const LAST_MESSAGE = MESSAGES_FOR_FEEDBACK.reduce(
        (acc, value) => (!acc || acc.created < value.created ? value : acc),
        null
      );
      if (LAST_MESSAGE) {
        LAST_MESSAGE.feedbackId = fb._id;
        LAST_MESSAGE.feedback = fb.score;
      }
    });

    messages = formatResponse(UTTERANCES, messages);
    if (!SHOW_SYSTEM_MESSAGES) {
      messages = messages.filter(item => item.source
        && item.source !== 'system'
      );
    }

    RET_VAL.messages = messages;
    RET_VAL.messagesTotal = messagesTotal;
    RET_VAL.reviews = reviews;
    RET_VAL.tags = tags;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneByConversationId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findOneByConversationId
}
