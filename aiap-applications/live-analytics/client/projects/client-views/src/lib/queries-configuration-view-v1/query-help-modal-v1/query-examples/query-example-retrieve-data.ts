/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
export const QUERY_EXAMPLE_RETRIEVE_DATA = `
#### Execute
\`\`\`javascript

const MODULE_ID = 'aca-live-analytics-query-conversations-count-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { getAcaConversationsDatasourceByContext } = require('@ibm-aca/aca-conversations-datasource-provider');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const retrieveData = async (context, params) => {
  let contextUserId;
  let datasource;
  let pipeline;
  try {
      contextUserId = context?.user?.id;
      pipeline = params?.qAggregations?.aggregatePipeline;
      datasource = await getAcaConversationsDatasourceByContext(context);
      const COLLECTION = datasource._collections.conversations;
      const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
      const RET_VAL = await ACA_MONGO_CLIENT.
          __aggregateToArray(context, {
              collection: COLLECTION,
              pipeline: pipeline,
          });
      return RET_VAL;
  } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { contextUserId, params });
      logger.error(retrieveData.name, { ACA_ERROR });
      throw ACA_ERROR;
  }
}
\`\`\`
`;
