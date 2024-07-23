/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `middleware-context-restore-service-retrieve-utterance-by-update-sender-action`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  getUpdateSessionContextAttribute
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  getTenantsCacheProvider
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAcaConversationsDatasourceByTenant
} from '@ibm-aca/aca-conversations-datasource-provider';

const retrieveUtteranceByUpdateSenderAction = async (update) => {

  let actionUtteranceId;
  let gAcaProps;

  let tenantsCacheProvider;
  let tenant;

  let datasource;

  let params;
  let context;
  let retVal;

  try {
    actionUtteranceId = update?.raw?.message?.sender_action?.data?.utteranceId;
    if (
      lodash.isEmpty(actionUtteranceId)
    ) {
      const ERROR_MESSAGE = 'Missing parameter - update.raw.message.sender_action.data.utteranceId!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    gAcaProps = getUpdateSessionContextAttribute(update, 'gAcaProps');
    if (
      lodash.isEmpty(gAcaProps)
    ) {
      const ERROR_MESSAGE = 'Unable to retrieve update.session.context.gAcaProps required object!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    tenantsCacheProvider = getTenantsCacheProvider();
    tenant = await tenantsCacheProvider.tenants.findOneByGAcaProps({ gAcaProps });
    if (
      lodash.isEmpty(tenant)
    ) {
      const ERROR_MESSAGE = 'Unable to retrieve tenant from tenantCacheProvider!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    datasource = getAcaConversationsDatasourceByTenant(tenant);

    params = { id: actionUtteranceId };
    context = {
      user: {
        session: { tenant }
      }
    };
    retVal = await datasource.utterances.findOneById(context, params);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveUtteranceByUpdateSenderAction.name, { ACA_ERROR });
    appendDataToError(ACA_ERROR, { gAcaProps, context, params, retVal });
    throw ACA_ERROR;
  }
}

export {
  retrieveUtteranceByUpdateSenderAction,
}
