/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import {
  _errorX,
} from 'client-utils';

@Injectable()
export class StorageServiceV1 {

  static getClassName() {
    return 'StorageServiceV1';
  }

  constructor() { }

  getConversationToken() {
    const TOKEN_OBJECT = this.getConversationTokenObject();
    let retVal;
    if (TOKEN_OBJECT) {
      retVal = TOKEN_OBJECT.token;
    }
    return retVal;
  }

  private getConversationTokenObject() {
    let retVal;
    let token;
    try {
      token = localStorage.getItem('conversationToken');
      if (token) {
        const tokenObject = JSON.parse(token);
        if (this.isExpired(tokenObject.expire)) {
          localStorage.removeItem('conversationToken');
          localStorage.removeItem(tokenObject.token);
        } else {
          retVal = tokenObject;
        }
      }
      return retVal;
    } catch (error) {
      _errorX(StorageServiceV1.getClassName(), 'getConversationTokenObject', {
        value: token,
        error,
      });
      throw error;
    }
  }

  private isExpired(expirationTime) {
    return expirationTime < new Date().getTime();
  }

}
