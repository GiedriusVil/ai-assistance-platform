/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');


const findUtteranceById = (id, utterances) => {
  const RET_VAL = utterances.find(u => {
    return u.id === id;
  });
  return RET_VAL;
}

const formatMessage = (
  message,
  utterance
) => {
  const MSG_TYPE = ramda.pathOr('', ['author'], message);

  const RET_VAL = {
    timestamp: message?.created,
    conversationId: message?.conversationId,
    utteranceId: message?.utteranceId,
    messageId: message?._id,
    //
    type: MSG_TYPE.toLocaleLowerCase(), // FIX ME what is this.
    source: message.author ? message.author.toLocaleLowerCase() : undefined,
    text: message?.message,
    attachment: message?.attachment,
    sender_action: ramda.pathOr(null, ['action'], message),
    //
    topIntent: utterance?.intent,
    topIntentFalsePositive: ramda.pathOr(false, ['topIntentFalsePositive'], utterance),
    //
    feedback: utterance?.feedback_score,
    feedbackId: message?.feedbackId,
    feedbackComment: utterance?.feedback_comment,
    //
    errors: message?.errors,
    //
    context: utterance?.context,
    raw: utterance?.raw,
    request: utterance?.request,
    aiService: utterance?.aiService,
    aiServiceRequest: utterance?.aiServiceRequest,
    aiServiceResponse: utterance?.aiServiceResponse,
    response: utterance?.response,
    aiChangeRequest: utterance?.aiChangeRequest,
  };
  return RET_VAL;
}


const formatResponse = (utterances, messages) => {
  const RET_VAL = messages.map(msg => {
    const UTTERANCE = findUtteranceById(msg.utteranceId, utterances)
    const FORMATTED_MESSAGE = formatMessage(msg, UTTERANCE);
    return FORMATTED_MESSAGE;
  });
  return RET_VAL;
};

module.exports = {
  formatResponse,
};
