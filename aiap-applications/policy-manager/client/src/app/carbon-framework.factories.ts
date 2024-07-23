/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IconService,
} from 'carbon-components-angular';

import * as Icons from "@carbon/icons";

export function iconServiceFactory(provider: IconService) {
  for (const [key, descriptor] of Object.entries(Icons)) {
    provider.register(descriptor as object);
  }
  const RET_VAL = () => {
    return new Promise((resolve, reject) => { resolve(true) });
  }
  return RET_VAL;
}