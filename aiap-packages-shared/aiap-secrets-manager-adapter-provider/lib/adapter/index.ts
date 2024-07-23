/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'secrets-manager-adapter-provider-adapter';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

export abstract class SecretsManagerAdapterV1 {

  constructor() {
    //
  }

  get secrets() {
    const RET_VAL = {
      setSecretKeyValues: (
        context: any,
        params: any,
      ) => {
        //
      },
    };
    return RET_VAL;
  }


  abstract initAdapterClientProviderByConfigurationProvider(
    provider: any,
  ): Promise<any>

}
