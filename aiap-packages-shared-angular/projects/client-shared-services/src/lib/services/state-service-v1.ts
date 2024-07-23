/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';

@Injectable()
export class StateServiceV1 {

  private savedStates: any = [];

  setSavedState(url, state) {
    this.savedStates[url] = ramda.mergeAll([this.getSavedState(url), state]);
  }

  getSavedState(url) {
    return ramda.pathOr({}, [url], this.savedStates);
  }
}
