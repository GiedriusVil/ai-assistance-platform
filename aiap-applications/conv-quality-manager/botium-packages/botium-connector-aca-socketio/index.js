/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const BotiumConnectorAcaSocketIOClass = require('./src/connector')

module.exports = {
  PluginVersion: 1,
  PluginClass: BotiumConnectorAcaSocketIOClass,
  PluginDesc: {
    name: 'Generic Socket.io Interface',
    provider: 'aca-team',
    features: {
      sendAttachments: true,
      audioInput: true
    }
  }
}
