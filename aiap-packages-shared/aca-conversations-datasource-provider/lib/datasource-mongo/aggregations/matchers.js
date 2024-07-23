/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { transformStringToDate } = require('@ibm-aiap/aiap-utils-date');
// const moment = require('moment');

/**
 * @matcher filters user messages (includes or excludes system messages based on param value)
 * @param {*} params query params
 */
const messageSource = (params) => {
  if (params.systemMessages === 'true') {
    return {
      $or: [
        { 'source': { $regex: 'user', $options: 'i' } },
        { 'source': { $regex: 'system', $options: 'i' } },
      ],
    };
  } else {
    return { 'source': { $regex: 'user', $options: 'i' } };
  }
};

/**
 * @matcher finds by utterance provided in params
 * @param {*} params query params
 */
const utterance = params => {
  if (params.utterance) {
    return { 'message': { $regex: params.utterance, $options: 'i' } };
  } else {
    return {};
  }
};

/**
 * @matcher finds conversation by id if provided in query params
 * @param {*} params query params
 */
const byConversationId = params => {
  const RET_VAL = {};
  if (params.conversationId) {
    RET_VAL._id = {
      $regex: params.conversationId,
      $options: 'i'
    }
  }
  return RET_VAL;
};


const conversationIdMatcher = (params) => {
  const RET_VAL = {};
  if (params.conversationId) {
    RET_VAL.conversationId = {
      $regex: params.conversationId,
      $options: 'i'
    }
  }
  return RET_VAL;
}


const byRegexField = (paramsField, dbField) => {
  if (!dbField) dbField = paramsField
  const RET_VAL = {};
  if (paramsField) {
    RET_VAL[dbField] = {
      $regex: paramsField,
      $options: 'i'
    }
  }
  return RET_VAL;
}

/**
 * @matcher finds conversation by employeeId if provided in query params
 * @param {*} params query params
 */
const byEmployeeId = params => {
  if (params.employeeId) {
    return { employeeId: { $regex: params.employeeId, $options: 'i' } };
  } else {
    return {};
  }
};

/**
 * @matcher finds conversation by tone if provided in query params
 * @param {*} params query params
 */
const byConversationTone = params => {
  if (params.tone) {
    return { tone: { $regex: params.tone, $options: 'i' } };
  } else {
    return {};
  }
};

const actionNeededIntent = params => {
  const matcher = {};
  if (params.intent || params.actionNeeded) {
    matcher.$and = [];
  }
  if (params.intent) {
    matcher.$and.push({ intent: { $eq: params.intent.toUpperCase() } });
  }

  // FIX ME -> Review logic. Also should be status or type?
  if (params.actionNeeded) {
    matcher.$and.push({
      $or: [
        { $and: [{ 'feedback.score': -1 }, { status: { $exists: false } }] },
        { $and: [{ intent: { $exists: false } }, { entity: { $exists: false } }] },
      ],
    });

    matcher.$and.push({
      $or: [{ status: { $exists: false } }, { status: 'NEW' }],
    });
  }
  return matcher;
};

const feedbackScore = params => {
  const matcher = {};
  if (params.score) {
    matcher['feedback.score'] = params.score;
  }
  return matcher;
};

/**
 * @matcher filters by selected skill Ids
 * @param {*} params
 */
const skill = params => {

  if (params.selectedSkills && params.selectedSkills.length > 0) {
    return { skillId: { $in: params.selectedSkills } };
  } else {
    return {};
  }
};

/**
 * @matcher finds by intent provided in params
 * @param {*} params
 */
const intent = params => {
  if (params.intent) {
    return { topIntent: { $eq: params.intent } };
  } else {
    return {};
  }
};

/**
 * @matcher filters items where timestamp value is between dates
 * @param {*} params query params
 */
const betweenDates = (params) => {
  const RET_VAL = betweenDatesOfField('timestamp', params);
  return RET_VAL;
};

/**
 * @matcher filters items where timestamp value is between dates
 * @param field name of field in structure
 * @param {*} params query params
 */
const betweenDatesOfField = (field, params) => {
  const RET_VAL = {};
  RET_VAL[field] = {};

  const DATE_FROM = ramda.path(['queryDate', 'from'], params);
  const DATE_TO = ramda.path(['queryDate', 'to'], params);

  if (DATE_FROM) {
    RET_VAL[field].$gte = transformStringToDate(DATE_FROM); // moment(params.queryDate.from).toDate();
  }
  if (DATE_TO) {
    RET_VAL[field].$lte = transformStringToDate(DATE_TO); //moment(params.queryDate.to).toDate();
  }
  return RET_VAL;
}


const tableLookup = (from, localField, foreignField, as) => ({
  $lookup: {
    from, localField, foreignField, as
  },
})

module.exports = {
  messageSource,
  utterance,
  skill,
  intent,
  actionNeededIntent,
  feedbackScore,
  byConversationId,
  byConversationTone,
  betweenDates,
  betweenDatesOfField,
  byEmployeeId,
  byRegexField,
  tableLookup,
  //
  conversationIdMatcher,
};
