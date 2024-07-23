/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

/*
* This is an abstract class definition with methods to be implemented by each actual Watsonx implementation
*/
const MODULE_ID = 'aiap-watsonx-provider-watsonx';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

abstract class AiapWatsonx {

  constructor() {
    //
  }

  get translation() {
    const RET_VAL = {
      translateText: (context: any, params: any): any => {}
    }
    return RET_VAL;
  }

}

export {
  AiapWatsonx,
};
