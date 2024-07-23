/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-analytics-live-datasource-provider-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const EventEmitter = require('events');

class AcaAnalyticsLiveDatasource extends EventEmitter {

  constructor(configuration) {
    try {
      super();
      this.configuration = configuration;
      this.id = this.configuration?.id;
      this.name = this.configuration?.name;
      this.hash = this.configuration?.hash;
      this.type = this.configuration?.type;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get conversations() {
    const RET_VAL = {
      findByQueryDayGroups: async (context, params) => { },
      findByQueryHourGroups: async (context, params) => { },
      findByQueryMonthGroups: async (context, params) => { },
      countByQuery: async (context, params) => { },
      avgDurationByQuery: async (context, params) => { },
      findWithUserInteraction: async (context, params) => { },
    };
    return RET_VAL;
  }

  get dashboardsConfigurations() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
      findOneById: async (context, params) => { },
      findOneByDashboardName: async (context, params) => { }
    };
    return RET_VAL;
  }

  get utterances() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findTopIntentsByQuery: async (context, params) => { },
      findLastIntentsByQuery: async (context, params) => { },
      findNegTopIntentsByQuery: async (context, params) => { },
      findLowConfidenceIntentsByQuery: async (context, params) => { },
      findTransferIntentsByQuery: async (context, params) => { },
      findTransferTotalsByQueryDayGroups: async (context, params) => { },
      findTransferTotalsByQueryHourGroups: async (context, params) => { },
      countByQuery: async (context, params) => { },
      countPerAiSkillByQuery: async (context, params) => { },
      countTransfersByQuery: async (context, params) => { },
      countByQueryActionNeeded: async (context, params) => { },
      countByQueryFalsePositive: async (context, params) => { },
      avgPerConversationByQuery: async (context, params) => { },
      avgPerConversationByQueryDayGroups: async (context, params) => { },
      avgPerConversationByQueryHourGroup: async (context, params) => { },
    };
    return RET_VAL;
  }

  get messages() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      avgPerConversationByQuery: async (context, params) => { },
    };
    return RET_VAL;
  }

  get channels() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
    };
    return RET_VAL;
  }

  get users() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findCountriesByQuery: async (context, params) => { },
      countByQuery: async (context, params) => { },
      findTotalUsersByQueryMonthGroups: async (context, params) => { },
      findNewUsersByQueryMonthGroups: async (context, params) => { },
      findReturningUsersByQueryMonthGroups: async (context, params) => { },
      findChannelUsersByQueryMonthGroups: async (context, params) => { },
    };
    return RET_VAL;
  }

  get tones() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
    };
    return RET_VAL;
  }

  get aiServices() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
    };
    return RET_VAL;
  }

  get aiIntents() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findManyWithLowConfidenceByQuery: async (context, params) => { },
      findManyWithNegativeFeedbackByQuery: async (context, params) => { },
      findManyBeforeTransferByQuery: async (context, params) => { },
      findTreeGraphsByQyery: async (context, params) => { }
    };
    return RET_VAL;
  }

  get aiEntities() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
    };
    return RET_VAL;
  }

  get entities() {
    const RET_VAL = {
      findConnectToAgentByQueryMonthGroups: async (context, params) => { },
      findGoodsRequestsByQueryMonthGroups: async (context, params) => { },
      findAccountingByQueryMonthGroups: async (context, params) => { },
      findApproverFlowByQueryMonthGroups: async (context, params) => { },
      findErrorMessageByQueryMonthGroups: async (context, params) => { },
      findBuyerInformationByQueryMonthGroups: async (context, params) => { },
    };
    return RET_VAL;
  }

  get surveys() {
    const RET_VAL = {
      findPositiveFeedbackByQueryMonthGroups: async (context, params) => { },
      findPositiveFeedbackTargetMonthGroups: async (context, params) => { },
    };
    return RET_VAL;
  }

}

module.exports = {
  AcaAnalyticsLiveDatasource
};
