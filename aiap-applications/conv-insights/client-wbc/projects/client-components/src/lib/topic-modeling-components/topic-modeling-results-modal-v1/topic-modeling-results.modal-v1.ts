/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

import * as ramda from 'ramda';
import * as lodash from 'lodash';


import {
  BaseModal
} from 'client-shared-views';

import {
  TopicModelingService
} from 'client-services';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';



@Component({
  selector: 'aiap-topic-modeling-results-modal-v1',
  templateUrl: './topic-modeling-results.modal-v1.html',
  styleUrls: ['./topic-modeling-results.modal-v1.scss'],
})
export class TopicModelingResultsModalV1 extends BaseModal implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'TopicModelingResultsModalV1';
  }

  _state = {
    urlSafe: undefined,
    jobId: undefined,
    jobName: undefined,
  };

  retrieveCentroids = true;

  topics = {};

  state: any = lodash.cloneDeep(this._state);
  returnCentroids = 'True';

  constructor(
    private sessionService: SessionServiceV1,
    private sanitizer: DomSanitizer,
    private topicModelingService: TopicModelingService,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleToggleChange(returnCentroids) {
    if (returnCentroids) {
      this.returnCentroids = 'True';
    } else {
      this.returnCentroids = 'False'
    }
    this.retrieveCentroids = !this.retrieveCentroids;
    this.retrieveScatterPlot();
  }

  retrieveScatterPlot() {
    const TENANT = this.sessionService.getTenant();
    const TENANT_ID = TENANT?.id;
    const TOPIC_MINER_URL = TENANT?.topicMinerBaseUrl;
    const JOB_ID = this.state?.jobId;
    const RETURN_CENTROIDS = this.returnCentroids;
    const QUERY_PARAMS = `jobId=${JOB_ID}&tenantId=${TENANT_ID}&returnCentroids=${RETURN_CENTROIDS}`
    const URL = `${TOPIC_MINER_URL}/api/topic-miner/result/get-chart-file?${QUERY_PARAMS}`;
    this.state.urlSafe = this.sanitizer['bypassSecurityTrustResourceUrl'](URL);
  }

  retrieveTopics() {
    this.topicModelingService.findTopicsByJobId(this.state.jobId)
      .subscribe(response => {
        _debugX(TopicModelingResultsModalV1.getClassName(), 'retrieveTopics', { response });
        this.topics = response;
      })
  }

  ngOnChanges() {

  }
  show(job) {
    this.state = lodash.cloneDeep(job);
    this.retrieveTopics();
    this.retrieveScatterPlot();
    this.superShow();
  }
}
