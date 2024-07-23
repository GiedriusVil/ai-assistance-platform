/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IDatasourceConfigurationV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IShadowDatasourceConversationsCollectionsV1,
} from '../collections';

interface IShadowDatasourceConfigurationConversationsV1 extends IDatasourceConfigurationV1 {
  collections: IShadowDatasourceConversationsCollectionsV1,
}

export {
  IShadowDatasourceConfigurationConversationsV1,
}
