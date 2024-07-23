/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('ramda');

const formatUtterance = (u) => {
  const RET_VAL = {
    id: u._id,
    conversationId: u.conversationId,
    status: u.status,
    timestamp: u.timestamp,

    raw: u?.raw,
    request: u?.request,
    aiService: u?.aiService,
    aiServiceRequest: u?.aiServiceRequest,
    aiServiceResponse: u?.aiServiceResponse,
    response: u?.response,

    //
    created: u.timestamp,

    utterance: u.message,
    intent: u.topIntent,
    //
    topIntentFalsePositive: ramda.path(['topIntentFalsePositive'], u),
    context: ramda.path(['context'], u),
    intents: ramda.pathOr([], ['intents'], u),
    entities: ramda.pathOr([], ['entities'], u),
    //
    entity: ramda.pathOr('', ['entities', 0, 'entity'], u),
    entity_value: ramda.pathOr('', ['entities', 0, 'score'], u),
    confidence: u.topIntentScore,
    feedback_score: ramda.pathOr('', ['feedbacks', 0, 'score'], u),
    feedback_reason: ramda.pathOr('', ['feedbacks', 0, 'reason'], u),
    feedback_comment: ramda.pathOr('', ['feedbacks', 0, 'comment'], u),
    utteranceStatus: u.status,
    username: ramda.pathOr('', ['users', 0, 'userId'], u),
    skillName: u.skillName,
    skillId: u.skillId,
    serviceId: u.serviceId,
    assistantId: u.assistantId,
    source: u.source,
    aiChangeRequest: u?.aiChangeRequest 
  };
  return RET_VAL;
}


const formatResponse = utterances => {
  const RET_VAL = utterances.map(u => {
    let formatedUtterance = formatUtterance(u);
    return formatedUtterance;
  });
  return RET_VAL;
};

module.exports = {
  formatResponse,
};
