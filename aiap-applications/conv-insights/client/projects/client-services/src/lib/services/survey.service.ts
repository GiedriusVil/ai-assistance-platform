/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class SurveyService extends BaseServiceV1 {

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  findManyByQuery(query: any) {
    const URL = `${this._hostUrl()}/api/v1/conversations/surveys`;
    return this.http.post(URL, query, this.getAuthHeaders());
  }

  findAvgScoreByQuery(query: any) {
    const URL = `${this._hostUrl()}/api/v1/conversations/surveys/average-score`;
    return this.http.post(URL, query, this.getAuthHeaders());
  }
}
