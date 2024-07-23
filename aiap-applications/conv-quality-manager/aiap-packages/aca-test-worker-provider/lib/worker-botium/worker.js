/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-botium-core-provider-aca-agent-worker';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ScriptingConstants, Events } = require('botium-core');

const { ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const AgentWorker = require('botium-core/src/grid/agent/AgentWorker');

class AcaAgentWorkerBotium extends AgentWorker {

  constructor(args = { socket: null, slot: null }) {
    super(args);
  }

  async RunJSONScript(script) {
    logger.info('RunJSONScript -> ', { script });
    const RAW_SCRIPT = JSON.stringify(script, null, 2);
    if (
      lodash.isEmpty(this.container)
    ) {
      const MESSAGE = `Container is not built. Please invoke Build method first!`;
      if (this.socket) {
        this.socket.emit(Events.CONTAINER_START_ERROR, MESSAGE);
      }
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const COMPILER = this.driver.BuildCompiler();
    COMPILER.Compile(RAW_SCRIPT, ScriptingConstants.SCRIPTING_FORMAT_JSON, ScriptingConstants.SCRIPTING_TYPE_CONVO);
    logger.info('RunJSONScript:convos', { convos: COMPILER.convos });
    const RET_VAL = [];
    if (
      lodash.isArray(COMPILER.convos)
    ) {
      for (const convo of COMPILER.convos) {
        let result = {
          authorization: ramda.path(['pluginInstance', 'authorization'], this.container),
        };
        try {
          result.transcript = await convo.Run(this.container);
          result.status = 'PASSED';
        } catch (error) {
          result.transcript = ramda.path(['transcript'], error);
          result.case = ramda.path(['cause'], error);
          result.status = 'FAILED';
        }
        RET_VAL.push(result);
      }
    }
    return RET_VAL;
  }

}

module.exports = {
  AcaAgentWorkerBotium,
}
