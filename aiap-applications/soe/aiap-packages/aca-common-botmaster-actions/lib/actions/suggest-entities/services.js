/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-common-botmaster-actions-botmaster-actions-suggest-entities'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const Spellchecker = require('hunspell-spellchecker');

const ramda = require('@ibm-aca/aca-wrapper-ramda');

class Services {

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

  getEntities(params) {
    // let username = params?.username;
    // let password = params?.password;
    // let url = params?.url;
    // let path = params?.path;
    // const RET_VAL = new Promise((resolve, reject) => {
    //   const conversation = new ConversationV1({
    //     username,
    //     password,
    //     url,
    //     version_date: ConversationV1.VERSION_DATE_2017_02_03,
    //   });
    //   conversation.getWorkspace({ workspace_id: path.workspace_id, export: true }, (err, workspace) => {
    //     if (err) {
    //       return reject(err);
    //     } else {
    //       const complexEntities = ramda.view(ramda.lensProp('entities'), workspace);
    //       // simplify them by creating an object of entity types where the value is an array of synonyms
    //       const entities = ramda.pipe(
    //         ramda.indexBy(ramda.prop('entity')),
    //         ramda.map(
    //           ramda.compose(
    //             ramda.map(e => ({ entity: e })),
    //             ramda.flatten,
    //             ramda.map(value => [value.value].concat(value.synonyms)),
    //             ramda.view(ramda.lensPath(['values']))
    //           )
    //         )
    //       )(complexEntities);
    //       logger.debug(`got ${ramda.values(entities).length} entity types for suggestEntity`);
    //       resolve(entities);
    //     }
    //   });
    // });
    // return RET_VAL;
  }
}

module.exports = {
  Services,
};
