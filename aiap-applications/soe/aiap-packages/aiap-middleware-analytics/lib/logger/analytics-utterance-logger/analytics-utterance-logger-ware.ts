/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-midleware-analytics-analytics-utterance-logger-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const moment = require('moment');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  shouldSkipBySenderActionTypes,
  enrichedByLambdaModuleAsyncExecutor,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  getTenantsCacheProvider,
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  getAcaConversationsDatasourceByTenant,
} from '@ibm-aca/aca-conversations-datasource-provider';

import {
  getConvShadowDatasourceByTenant,
} from '@ibm-aiap/aiap-conv-shadow-datasource-provider';

import {
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  AbstractLoggerWare,
} from '../abstract-logger-ware';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';


const SOURCE = {
  SYSTEM: 'SYSTEM',
  USER: 'USER',
};

export class AnalyticsUtteranceLoggerWare extends AbstractLoggerWare {

  timestamp: any;
  serviceType: any;

  constructor(
    configuration: any,
  ) {
    super(
      [
        botStates.NEW,
        botStates.UPDATE,
        botStates.INTERNAL_UPDATE
      ],
      'analytics-utterance-logger',
      middlewareTypes.INCOMING,
      configuration
    );
  }

  __shouldSkip(
    context: {
      update: ISoeUpdateV1,
    },
  ) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };
    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);
    if (
      IGNORE_BY_SENDER_ACTION_TYPE
    ) {
      return true;
    }
    return false;
  }

  setTimestamp() {
    this.timestamp = moment(new Date()).utc().toDate();
  }

  setServiceType(
    update: ISoeUpdateV1,
  ) {
    this.serviceType = update?.session?.dialogType || 'WA';
  }

  getMessage(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.message?.text;
    return RET_VAL;
  }

  getResponse(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.response;
    return RET_VAL;
  }

  getServiceType() {
    return this.serviceType;
  }

  getType(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.status;
    return RET_VAL;
  }

  getSkillVersion() {
    return null;
  }

  getServiceId(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.session?.aiService?.id;
    return RET_VAL;
  }

  getSkillId(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.session?.aiService?.aiSkill?.id;
    return RET_VAL;
  }

  getSkillName(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.session?.aiService?.aiSkill?.name;
    return RET_VAL;
  }

  getSentiment() {
    return null;
  }

  getTopIntent(
    update: ISoeUpdateV1,
  ) {
    let retVal;
    switch (update?.aiServiceResponse?.type) {
      case 'WA':
        retVal = ramda.pathOr(
          null,
          [
            'aiServiceResponse',
            'external',
            'result',
            'intents',
            0,
            'intent'
          ],
          update,
        );
        break;
      case 'WA_V2':
        retVal = ramda.pathOr(
          null,
          [
            'aiServiceResponse',
            'external',
            'result',
            'output',
            'intents',
            0,
            'intent'
          ],
          update,
        );
        break;
      default:
        retVal = null;
    }
    return retVal;
  }

  getTopIntentScore(
    update: ISoeUpdateV1,
  ) {
    let retVal;
    switch (update?.aiServiceResponse?.type) {
      case 'WA':
        retVal = ramda.pathOr(
          null,
          [
            'aiServiceResponse',
            'external',
            'result',
            'intents',
            0,
            'confidence',
          ],
          update,
        );
        break;
      case 'WA_V2':
        retVal = ramda.pathOr(
          null,
          [
            'aiServiceResponse',
            'external',
            'result',
            'output',
            'intents',
            0,
            'confidence',
          ],
          update,
        );
        break;
      default:
        retVal = null;
    }
    return retVal;
  }

  getContext(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.session?.context || {};
    return RET_VAL;
  }

  getState(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.session?.state || {};
    return RET_VAL;
  }

  getDialogNodes(
    update: ISoeUpdateV1,
  ) {
    let retVal;
    switch (update?.aiServiceResponse?.type) {
      case 'WA':
        retVal = ramda.pathOr(
          null,
          [
            'aiServiceResponse',
            'external',
            'result',
            'output',
            'nodes_visited',
          ],
          update,
        );
        break;
      default:
        retVal = null;
    }
    return retVal;
  }

  getFlowName() {
    return null;
  }

  getFlowState() {
    return null;
  }

  getTimestamp() {
    return this.timestamp;
  }

  getSource(
    update: ISoeUpdateV1,
  ) {
    const MESSAGE = this.getMessage(update);
    if (lodash.startsWith(MESSAGE, '§§')) {
      return SOURCE.SYSTEM;
    } else {
      const RET_VAL = ramda.pathOr(SOURCE.USER, ['source'], update);
      return RET_VAL.toUpperCase();
    }
  }

  _getIntents(
    update: ISoeUpdateV1,
    intents: any,
  ) {
    const RECORDS = [];
    if (
      lodash.isArray(intents) &&
      !lodash.isEmpty(intents)
    ) {
      // TODO LEGO - Why we need to slice array here? Any thoughts?
      intents = intents.slice(0, 3);
      for (const INTENT of intents) {
        RECORDS.push({
          // EXTERNAL_IDENTIFIERS - START
          tenantId: this.getTenantId(update),
          assistantId: this.getAssistantId(update),
          utteranceId: this.getUtteranceId(update),
          // EXTERNAL_IDENTIFIERS - END
          timestamp: this.getTimestamp(),
          serviceId: this.getServiceId(update),
          intent: INTENT?.intent,
          score: INTENT?.confidence,
          sequence: intents.indexOf(INTENT),
        });
      }
    }
    return RECORDS;
  }

  _getEntities(
    update: ISoeUpdateV1,
    entities: any,
  ) {
    const RECORDS = [];
    if (
      lodash.isArray(entities) &&
      !lodash.isEmpty(entities)
    ) {
      for (const ENTITY of entities) {
        RECORDS.push({
          // EXTERNAL_IDENTIFIERS - START
          tenantId: this.getTenantId(update),
          assistantId: this.getAssistantId(update),
          utteranceId: this.getUtteranceId(update),
          // EXTERNAL_IDENTIFIERS - END
          timestamp: this.getTimestamp(),
          serviceId: this.getServiceId(update),
          entity: ENTITY?.entity,
          score: ENTITY?.confidence,
          sequence: entities.indexOf(ENTITY),
        });
      }
    }
    return RECORDS;
  }

  getIntents(
    update: ISoeUpdateV1,
  ) {
    let retVal;
    let intents;
    switch (update?.aiServiceResponse?.type) {
      // TODO: add aiServiceTypes object
      case 'WA':
        intents = ramda.pathOr(
          [],
          [
            'aiServiceResponse',
            'external',
            'result',
            'intents'
          ],
          update
        );
        retVal = this._getIntents(update, intents);
        break;
      case 'WA_V2':
        intents = ramda.pathOr(
          [],
          [
            'aiServiceResponse',
            'external',
            'result',
            'output',
            'intents'
          ],
          update
        );
        retVal = this._getIntents(update, intents);
        break;
      default:
        retVal = [];
    }
    return retVal;
  }

  getEntities(
    update: ISoeUpdateV1,
  ) {
    let retVal;
    let entities;
    switch (update?.aiServiceResponse?.type) {
      // TODO: add aiServiceTypes object
      case 'WA':
        entities = ramda.pathOr(
          [],
          [
            'aiServiceResponse',
            'external',
            'result',
            'entities'
          ],
          update
        );
        retVal = this._getEntities(update, entities);
        break;
      default:
        retVal = [];
    }
    return retVal;
  }

  getAiService(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = {
      id: update?.session?.aiService?.id,
      name: update?.session?.aiService?.name,
      type: update?.session?.aiService?.type,
      aiSkill: {
        id: update?.session?.aiService?.aiSkill?.id,
        name: update?.session?.aiService?.aiSkill?.name,
        type: update?.session?.aiService?.aiSkill?.type,
      },
    };
    return RET_VAL;
  }

  getAiServiceRequest(
    update: ISoeUpdateV1,
  ) {
    return update?.aiServiceRequest || null;
  }

  getAiServiceResponse(
    update: ISoeUpdateV1,
  ) {
    return update?.aiServiceResponse || null;
  }

  getMetricsTracker(
    update: ISoeUpdateV1
  ) {
    return update?.metricsTracker || {};
  }

  getRaw(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = {
      message: {
        text: update?.raw?.message?.text,
      },
    };
    return RET_VAL;
  }

  getRequest(
    update: ISoeUpdateV1,
  ) {
    return update?.request || null;
  }

  formRecord(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = {
      // data payload required for utterances table
      utterance: {
        id: this.getUtteranceId(update),
        // EXTERNAL_IDENTIFIERS - START
        tenantId: this.getTenantId(update),
        assistantId: this.getAssistantId(update),
        conversationId: this.getConversationId(update),
        serviceId: this.getServiceId(update),
        skillId: this.getSkillId(update),
        // EXTERNAL_IDENTIFIERS - START
        message: this.getMessage(update),
        serviceType: this.getServiceType(),
        type: this.getType(update),
        skillVersion: this.getSkillVersion(),
        skillName: this.getSkillName(update),
        sentiment: this.getSentiment(),
        topIntent: this.getTopIntent(update),
        topIntentScore: this.getTopIntentScore(update),
        metricsTracker: this.getMetricsTracker(update),
        context: this.getContext(update),
        state: this.getState(update),
        dialogNodes: this.getDialogNodes(update),
        flowName: this.getFlowName(),
        flowState: this.getFlowState(),
        source: this.getSource(update),
        timestamp: this.getTimestamp(),
        //
        aiService: this.getAiService(update),
        aiServiceRequest: this.getAiServiceRequest(update),
        aiServiceResponse: this.getAiServiceResponse(update),
        raw: this.getRaw(update),
        request: this.getRequest(update),
        response: this.getResponse(update),
      },
      // data payload required for intents table
      intents: this.getIntents(update),
      // data payload required for entities table
      entities: this.getEntities(update),
    };
    return RET_VAL;
  }

  async defaultExecutor(
    context: IContextV1,
    params: {
      update: ISoeUpdateV1,
    },
  ) {
    try {
      const UPDATE = params?.update;
      const G_ACA_PROPS = UPDATE.raw?.gAcaProps;

      if (
        lodash.isEmpty(UPDATE)
      ) {
        {
          const ERROR_MESSAGE = 'Missing required params.update parameter!';
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE,
            {
              gAcaProps: G_ACA_PROPS,
            });
        }
      }
      if (
        UPDATE.skipConversationLogger
      ) {
        return;
      }

      const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
      const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({
        gAcaProps: G_ACA_PROPS,
      });
      const DATASOURCE = await getAcaConversationsDatasourceByTenant(TENANT);
      const DATASOURCE_SHADOW = await getConvShadowDatasourceByTenant(TENANT);
      if (
        lodash.isEmpty(DATASOURCE)
      ) {
        const ERROR_MESSAGE = 'Unable to retrieve conversations datasource!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE,
          {
            gAcaProps: G_ACA_PROPS,
          });
      }
      this.setTimestamp();
      this.setServiceType(UPDATE);
      const RECORD = this.formRecord(UPDATE);
      await DATASOURCE.utterances.saveOne(context, {
        utterance: RECORD?.utterance,
      });

      if (
        !lodash.isEmpty(DATASOURCE_SHADOW)
      ) {
        await DATASOURCE_SHADOW.utterances.saveOne(
          context,
          {
            value: {
              id: RECORD.utterance.id,
              timestamp: RECORD.utterance.timestamp,
              conversationId: RECORD.utterance.conversationId,
              topIntent: RECORD.utterance.topIntent,
              request: RECORD.utterance.request,
              skillName: RECORD.utterance.skillName,
              dialogNodes: RECORD.utterance.dialogNodes,
              response: RECORD.utterance.response,
              metricsTracker: RECORD.utterance.metricsTracker,
              aiServiceRequest: RECORD.utterance.aiServiceRequest,
              aiServiceResponse: RECORD.utterance.aiServiceResponse,
              tenantId: RECORD.utterance.tenantId,
              assistantId: RECORD.utterance.assistantId,
              context: RECORD.utterance.context
            }
          }
        )
      }
      await DATASOURCE.entities.saveMany(context, {
        entities: RECORD?.entities,
      });
      await DATASOURCE.intents.saveMany(context, { intents: RECORD?.intents });
      logger.info(
        `Executed utterance logging! [conversation_id: ${this.getConversationId(
          UPDATE
        )}]`
      );
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.defaultExecutor.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async executor(bot, update) {
    try {
      await enrichedByLambdaModuleAsyncExecutor({
        moduleId: MODULE_ID,
        adapter: bot,
        update,
        defaultExecutor: this.defaultExecutor.bind(this),
      });
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.executor.name, { ACA_ERROR });
      return;
    }
  }
}
