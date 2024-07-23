/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-ai-services-find-services';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const findServices = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.utterances;

  let query;
  try {
    const { employeeId, conversationId } = params;
    if (lodash.isEmpty(conversationId)) {
      const MESSAGE = `Missing required conversationId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(employeeId)) {
      const MESSAGE = `Missing required employeeId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);

    }
    query = [];
    if (!lodash.isEmpty(employeeId)) {
      query.push(
        {
          $match: {
            $and: [{ employeeId: { $regex: params.employeeId, $options: 'i' } }],
          },
        },
        {
          $group: {
            _id: '$serviceId',
          },
        }
      );
    } else if (!lodash.isEmpty(conversationId)) {
      query.push(
        {
          $match: {
            $and: [{
              conversationId: {
                $regex: params.conversationId,
                $options: 'i'
              }
            }],
          },
        },
        {
          $group: {
            _id: '$serviceId',
          },
        },
      );
    }

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
      });
    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const SERVICE_IDS = ramda.pathOr([], ['items'], RESULT);
    if (lodash.isEmpty(SERVICE_IDS)) {
      const message = employeeId ? `${employeeId} employee id.` : `${conversationId} conversationId.`;
      logger.info(`Could not find any ai services for ${message}`);
    }
    const RET_VAL = SERVICE_IDS.map(item => item._id);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findServices.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findServices,
};
