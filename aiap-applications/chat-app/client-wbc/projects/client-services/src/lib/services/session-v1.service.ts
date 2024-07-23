/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

@Injectable()
export class SessionServiceV1 {

  private session;

  public getSession() {
    return this.session;
  }

  public setSession(session) {
    this.session = session;
  }
}
