/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-classifier-switch-to-ai-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  getUpdateSessionContext,
} from '@ibm-aiap/aiap-utils-soe-update';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAiServicesDatasourceByTenant,
} from '@ibm-aiap/aiap-ai-services-datasource-provider';


const switchToAiService = async (
  update: ISoeUpdateV1,
  params: {
    aiService?: IAiServiceV1,
    selectedIntent?: any,
  },
) => {

  let paramsAiService;
  let paramsAiServiceId;
  let paramsAiServiceAiSkillId;
  let paramsSelectedIntent;

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

    paramsSelectedIntent = params?.selectedIntent;
    // updateSession = getUpdateSession(update);
    updateSessionContext = getUpdateSessionContext(update);
    gAcaProps = updateSessionContext?.gAcaProps;
    if (
      lodash.isEmpty(paramsAiServiceId)
    ) {
      const MESSAGE = `Missing required params.aiService.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(gAcaProps)
    ) {
      const MESSAGE = `Unable to retrieve update.session.context.gAcaProps required object!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    tenantCacheProvider = getTenantsCacheProvider();
    tenant = await tenantCacheProvider.tenants.findOneByGAcaProps({ gAcaProps });
    datasource = getAiServicesDatasourceByTenant(tenant);

    const CONTEXT = {
      user: {
        id: 'SYSTEM_SOE'
      }
    };
    const PROMISES = [];
    PROMISES.push(datasource.aiServices.findOneById(
      CONTEXT,
      { id: paramsAiServiceId }
    ));

    if (
      !lodash.isEmpty(paramsAiServiceAiSkillId)
    ) {
      PROMISES.push(datasource.aiSkills.findOneById(
        CONTEXT,
        {
          id: paramsAiServiceAiSkillId,
        }
      ));
    }

    [rawAiService, rawAiSkill] = await Promise.all(PROMISES);

    console.log(MODULE_ID,
      {
        rawAiService,
        rawAiSkill,
      }
    );

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
        id: rawAiSkill?.id,
        name: rawAiSkill?.name,
        external: rawAiSkill?.external,
        selectedIntent: paramsSelectedIntent,
      };
    }
    // [TODO] setUpdateSessionAiService -> We need simple method for this! Just aiService as input!
    update.session.aiService = aiService;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { paramsAiService, paramsSelectedIntent, aiService });
    logger.error(switchToAiService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  switchToAiService,
}
