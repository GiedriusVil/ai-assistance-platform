/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middleware-conversation-tone-ware'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { AbstractMiddleware, botStates, middlewareTypes } = require('@ibm-aiap/aiap-soe-brain');
const { toneAnalyzer } = require('@ibm-aca/aca-conversation-tone-analyzer');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaConversationsDatasourceByTenant } = require('@ibm-aca/aca-conversations-datasource-provider');

const { getLibConfiguration } = require('./configuration');

class ConversationToneWare extends AbstractMiddleware {

  constructor() {
    super(
      [
        botStates.NEW,
        botStates.UPDATE
      ],
      'conversation-tone-ware',
      middlewareTypes.OUTGOING
    );
    const CONFIGURATION = getLibConfiguration();
    this.toneAnalyzer = toneAnalyzer(CONFIGURATION?.toneAnalyzer);
    this.ongoingChats = {};
  }

  async executor(adapter, update) {
    const UPDATE_SENDER_ID = ramda.path(['sender', 'id'], update);
    try {
      const ONGOING_CHAT = this.ongoingChats[UPDATE_SENDER_ID];
      if (
        ONGOING_CHAT
      ) {
        clearTimeout(ONGOING_CHAT);
      }
      this.ongoingChats[UPDATE_SENDER_ID] = setTimeout(
        this.analyzeChat,
        this.config.inactivityTimeout,
        this,
        update
      );
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID })
      logger.error('executor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async analyzeChat(_this, update) {
    const UPDATE_SENDER_ID = ramda.path(['sender', 'id'], update);
    const LIB_CONFIGURATION = getLibConfiguration();
    let conversationId;
    let toneDoc;
    try {
      const G_ACA_PROPS = ramda.path(['gAcaProps'], update);
      const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();
      const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByGAcaProps({ gAcaProps: G_ACA_PROPS });
      const DATASOURCE = getAcaConversationsDatasourceByTenant(TENANT);
      const TRANSCRIPT = DATASOURCE.transcripts.findOneById({}, { id: UPDATE_SENDER_ID });

      if (
        lodash.isArray(TRANSCRIPT) &&
        TRANSCRIPT.length < LIB_CONFIGURATION.minUtterances
      ) {
        logger.info(`Skipping middleware - minimum utterance are not reached yet! [UPDATE_SENDER_ID: ${UPDATE_SENDER_ID}]`);
        return;
      }
      const TEXT = TRANSCRIPT.map((item) => {
        let itemText = ramda.path(['text'], item);
        if (
          lodash.isEmpty(itemText)
        ) {
          return '.';
        } else {
          return itemText;
        }
      }).join('. ');
      logger.debug('[INFO] user utterances', { TEXT });
      if (
        !lodash.isEmpty(TEXT)
      ) {
        const TONE_ANALYZER_RESPONSE = await _this.toneAnalyzer(TEXT, update);
        const TONES = ramda.pathOr([], ['result', 'document_tone', 'tones'], TONE_ANALYZER_RESPONSE);
        logger.info('[INFO] conversation tones', { TONES });
        const TOP_TONE = _this.getTopTone(TONES);

        if (TOP_TONE) {
          const TONE = {
            tones: TONES,
            topTone: TOP_TONE,
            conversationId: conversationId,
          };
          await DATASOURCE.tones.saveOne({}, { tone: TONE });
          await self.controller.saveTone(toneDoc);
        }
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { UPDATE_SENDER_ID });
      logger.error('analyzeChat', { ACA_ERROR });
    } finally {
      delete self.ongoingChats[UPDATE_SENDER_ID];
    }
  }

  getTopTone(tones) {
    let topTone;
    tones.forEach(tone => {
      if (!topTone) {
        topTone = tone;
        return;
      }
      if (topTone.score < tone.score) {
        topTone = tone;
      }
    });
    return topTone;
  }
}


module.exports = {
  ConversationToneWare
};
