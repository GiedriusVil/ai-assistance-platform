/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  convertArrayToQueryParamsString
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class TopicModelingService extends BaseServiceV1 {

  static getClassName() {
    return 'TopicModelingService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    let retVal = `${this._hostUrl()}/api/v1/topic-modeling`;
    return retVal;
  }



  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TopicModelingService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  findTopicsByJobId(jobId: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-topics-by-job-id`;
    const REQUEST = { jobId };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TopicModelingService.getClassName(), 'findManyByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  saveOne(topic: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = topic;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TopicModelingService.getClassName(), 'saveOne', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  findOneById(id: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TopicModelingService.getClassName(), 'findOneById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  exportMany(params) {
    const IDS = params?.ids;
    const JOB_ID = params?.jobId;
    const IDS_QUERY_PARAM = convertArrayToQueryParamsString('ids', IDS);

    const REQUEST_URL = `${this._hostAndBasePath()}/export/topics?` //
      + `jobId=${JOB_ID}&` //
      + `token=${this._token()}&` //
      + IDS_QUERY_PARAM;

    this.browserService.openInNewTab(REQUEST_URL);
  }


  getNewJob() {
    const REQUEST_URL = `${this._hostAndBasePath()}/new-topic-modeling-job`;
    const REQUEST_OPTIONS = this._requestOptions();
    return this.http.post(REQUEST_URL, {}, REQUEST_OPTIONS);
  }

  getSummaryByQuery(query) {
    const REQUEST_URL = `${this._hostAndBasePath()}/get-summary-by-query`;
    const REQUEST = query;
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TopicModelingService.getClassName(), 'getSummaryByQuery', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  executeJobById(id) {
    const REQUEST_URL = `${this._hostAndBasePath()}/execute-job-by-id`;
    const REQUEST = { id };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TopicModelingService.getClassName(), 'executeJobById', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(TopicModelingService.getClassName(), 'deleteManyByIds', { REQUEST_URL, REQUEST, REQUEST_OPTIONS });
    const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    return RET_VAL;
  }
}
