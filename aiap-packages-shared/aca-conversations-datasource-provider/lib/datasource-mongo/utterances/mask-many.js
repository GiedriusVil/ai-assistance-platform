/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-utterances-mask-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { saveMany } = require('./save-many');

const maskMany = async (datasource, context, params) => {
  let session;
  try {
      const CLIENT = await datasource._getClient();
      session = await CLIENT.startSession();
      session.startTransaction();
      const OPTIONS = {
          session: session
      };
      await saveMany(datasource, context, { values: params?.items, options: OPTIONS });      
      const RET_VAL = await session.commitTransaction();

      return RET_VAL;
  } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(maskMany.name, { ACA_ERROR });
      await session.abortTransaction();
      throw ACA_ERROR;
  } finally {
      await session.endSession();
  }
}

module.exports = {
  maskMany,
}
