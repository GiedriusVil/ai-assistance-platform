/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-transcripts-mask-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _conversations = require('../conversations');
const _messages = require('../messages');
const _utterances = require('../utterances');
const _feedbacks = require('../feedbacks');
const _surveys = require('../surveys');

const maskOne = async (datasource, context, params) => {
  let session;
  try {
    const CLIENT = await datasource._getClient();
    session = await CLIENT.startSession();

    await session.withTransaction(async () => {
      const OPTIONS = {
        session: session
      };
      await _conversations.saveMany(datasource, context, { values: params?.conversations, options: OPTIONS });
      await _messages.saveMany(datasource, context, { values: params?.messages, options: OPTIONS });
      await _utterances.saveMany(datasource, context, { values: params?.utterances, options: OPTIONS });
      await _feedbacks.saveMany(datasource, context, { values: params?.feedbacks, options: OPTIONS });
      await _surveys.saveMany(datasource, context, { values: params?.surveys, options: OPTIONS });
      
      await session.commitTransaction();
    });

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(maskOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  } finally {
    await session.endSession();
  }
}

module.exports = {
  maskOne,
}
