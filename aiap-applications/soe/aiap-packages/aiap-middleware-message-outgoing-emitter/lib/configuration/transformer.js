/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_OUTGOING_MESSAGE_EMITTER_ENABLED', false, {
    fallbackMessage: rawConfiguration.AIAP_OUTGOING_MESSAGE_EMITTER_FALLBACK_MESSAGE,
    withHandover: provider.isEnabled('AIAP_OUTGOING_MESSAGE_EMITTER_WITH_HANDOVER'),
    handoverSkill: rawConfiguration.AIAP_OUTGOING_MESSAGE_EMITTER_HANDOVER_SKILL,
    handoverMessage: rawConfiguration.AIAP_OUTGOING_MESSAGE_EMITTER_HANDOVER_MESSAGE,
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
