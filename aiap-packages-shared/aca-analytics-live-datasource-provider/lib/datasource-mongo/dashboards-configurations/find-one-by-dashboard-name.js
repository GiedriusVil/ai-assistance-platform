/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-dashboards-configurations-find-one-by-dashboard-name';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');
const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const findOneByDashboardName = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.dashboardsConfigurations;

  let filter;
  try {
    const DASHBOARD = ramda.path(['dashboard'], params)
    filter = {
      dashboard: DASHBOARD
    };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        filter: filter
      });

    const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(findOneByDashboardName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findOneByDashboardName
}
