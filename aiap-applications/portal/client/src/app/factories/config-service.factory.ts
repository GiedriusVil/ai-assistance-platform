/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ConfigServiceV1,
} from 'client-shared-services';

export function configServiceFactory(provider: ConfigServiceV1) {
  return () => provider.load();
} 
