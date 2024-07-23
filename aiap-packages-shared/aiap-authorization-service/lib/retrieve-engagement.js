/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-authorization-service-retrieve-engagement';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getEngagementsDatasourceByTenant } = require('@ibm-aiap/aiap-engagements-datasource-provider');

const retrieveEngagement = async (gAcaProps, tenant) => {
  const G_ACA_PROPS_ENGAGEMENT_ID = gAcaProps?.engagementId;
  try {
    const DATASOURCE = getEngagementsDatasourceByTenant(tenant);
    if (
      lodash.isEmpty(DATASOURCE)
    ) {
      const MESSAGE = 'Unable to retrieve engagements datasource!';
      throwAcaError(ACA_ERROR_TYPE.SYSTEM_ERROR, MODULE_ID, MESSAGE);
    }
    const CONTEXT = {
      user: {
        id: 'CHAT_APP_USER'
      }
    }
    const ENGAGEMENT = await DATASOURCE.engagements.findOneLiteById(CONTEXT, { id: G_ACA_PROPS_ENGAGEMENT_ID });
    if (
      lodash.isEmpty(ENGAGEMENT)
    ) {
      const MESSAGE = 'Unable to retrieve engagement!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    return ENGAGEMENT;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.data = {
      tenant: {
        id: tenant?.id,
        hash: tenant?.hash,
      },
      engagement: {
        id: G_ACA_PROPS_ENGAGEMENT_ID
      }
    }
    logger.error(retrieveEngagement.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  retrieveEngagement,
}
