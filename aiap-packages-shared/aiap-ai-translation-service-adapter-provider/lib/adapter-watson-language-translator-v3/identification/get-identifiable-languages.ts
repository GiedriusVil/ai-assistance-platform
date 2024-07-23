/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watson-language-translator-v3-get-identifiable-models';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IGetIdentifiableLanguagesParamsV1 } from '../types/params';

const getIdentifiableLanguages = (
  context: IContextV1,
  params: IGetIdentifiableLanguagesParamsV1
) => {
  
};

export {
  getIdentifiableLanguages,
};
