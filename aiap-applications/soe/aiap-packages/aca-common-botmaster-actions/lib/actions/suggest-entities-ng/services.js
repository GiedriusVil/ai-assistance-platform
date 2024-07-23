/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const logger = require('@ibm-aca/aca-common-logger')('botmaster:actions:suggestEntities');
const R = require('ramda');
const Spellchecker = require('hunspell-spellchecker');

class services {
  constructor(dictionary) {
    this.spellcheckerPromiseVar = new Promise((resolve, reject) => {
      dictionary((err, dict) => {
        if (err) reject(err);
        else {
          const spellchecker = new Spellchecker();
          const DICT = spellchecker.parse(dict);
          spellchecker.use(DICT);
          resolve(spellchecker);
        }
      });
    });
  }

  spellcheckerPromise() {
    return this.spellcheckerPromiseVar;
  }

  getEntities(credentials, waService) {
    return new Promise((resolve, reject) => {
      const service = waService.getEndpointByID(credentials.serviceId);
      const conversation = service.conversation;
      const workspaceId = credentials.workspaceId || service.getWorkspaceIDByName(credentials.workspaceName);
      conversation.getWorkspace({ workspace_id: workspaceId, export: true }, (err, workspace) => {
        if (err) {
          return reject(err);
        } else {
          const complexEntities = R.view(R.lensProp('entities'), workspace);
          // simplify them by creating an object of entity types where the value is an array of synonyms
          const entities = R.pipe(
            R.indexBy(R.prop('entity')),
            R.map(
              R.compose(
                R.map(e => ({ entity: e })),
                R.flatten,
                R.map(value => [value.value].concat(value.synonyms)),
                R.view(R.lensPath(['values']))
              )
            )
          )(complexEntities);
          logger.debug(`got ${R.values(entities).length} entity types for suggestEntity`);
          resolve(entities);
        }
      });
    });
  }
}

module.exports = services;
