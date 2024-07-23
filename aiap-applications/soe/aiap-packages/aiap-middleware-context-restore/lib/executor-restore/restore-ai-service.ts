/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'middleware-context-restore-executor-restore-ai-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  // getUpdateSession, 
  getUpdateSessionContext
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  getTenantsCacheProvider
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAiServicesDatasourceByTenant
} from '@ibm-aiap/aiap-ai-services-datasource-provider';

const restoreAiService = async (update, params) => {

  let paramsAiService;
  let paramsAiServiceId;
  let paramsAiServiceAiSkillId;

  // let updateSession;
  let updateSessionContext;

  let gAcaProps;

  let tenantCacheProvider;
  let tenant;

  let datasource;

  let rawAiService;
  let rawAiSkill;

  let aiService;
  try {
    paramsAiService = params?.aiService;
    paramsAiServiceId = paramsAiService?.id;
    paramsAiServiceAiSkillId = paramsAiService?.aiSkill?.id;
    // updateSession = getUpdateSession(update);
    updateSessionContext = getUpdateSessionContext(update);
    gAcaProps = updateSessionContext?.gAcaProps;
    if (
      lodash.isEmpty(paramsAiServiceId)
    ) {
      const ERROR_MESSAGE = `Missing required params.aiService.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(paramsAiServiceAiSkillId)
    ) {
      const ERROR_MESSAGE = `Missing required params.aiService.aiSkill.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(gAcaProps)
    ) {
      const ERROR_MESSAGE = `Unable to retrieve update.session.context.gAcaProps required object!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    tenantCacheProvider = getTenantsCacheProvider();
    tenant = await tenantCacheProvider.tenants.findOneByGAcaProps({ gAcaProps });
    datasource = getAiServicesDatasourceByTenant(tenant);

    const CONTEXT = { user: { id: 'SYSTEM_SOE' } };
    const PROMISES = [];
    PROMISES.push(datasource.aiServices.findOneById(
      CONTEXT,
      { id: paramsAiServiceId }
    ));
    PROMISES.push(datasource.aiSkills.findOneById(
      CONTEXT,
      { id: paramsAiServiceAiSkillId }
    ));
    const PROMISES_RESULT = await Promise.all(PROMISES);

    rawAiService = ramda.path([0], PROMISES_RESULT);
    rawAiSkill = ramda.path([1], PROMISES_RESULT);

    aiService = {
      id: rawAiService?.id,
      name: rawAiService?.name,
      type: rawAiService?.type,
      external: rawAiService?.external,
    };
    if (
      !lodash.isEmpty(rawAiSkill)
    ) {
      aiService.aiSkill = {
        id: rawAiSkill.id,
        name: rawAiSkill.name,
        external: rawAiSkill.external,
      };
    }
    // [TODO] setUpdateSessionAiService -> We need simple method for this! Just aiService as input!
    update.session.aiService = aiService;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { paramsAiService, aiService });
    logger.error(`${restoreAiService.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  restoreAiService,
}
