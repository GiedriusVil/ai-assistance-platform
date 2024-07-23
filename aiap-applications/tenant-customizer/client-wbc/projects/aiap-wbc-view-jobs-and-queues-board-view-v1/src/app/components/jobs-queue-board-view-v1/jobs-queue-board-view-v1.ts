/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  ConfigServiceV1
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-jobs-queue-board-view-v1',
  templateUrl: './jobs-queue-board-view-v1.html',
  styleUrls: ['./jobs-queue-board-view-v1.scss'],
})
export class JobsQueueBoardViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'JobsQueueBoardViewV1';
  }

  state: any = {
    url: 'http://localhost:3001/bull-board',
    urlSafe: undefined,
  }

  constructor(
    private sessionService: SessionServiceV1,
    private configService: ConfigServiceV1,
    private sanitizer: DomSanitizer,
  ) {
    super();
  }

  ngOnInit() {
    const CONFIG = this.configService.getConfig();
    const TENANT = this.sessionService.getTenant();
    const TENANT_ID = TENANT?.id;
    const ENDPOINT = CONFIG?.app?.jobsQueuesFrontEndpoint;
    const URL = `${ENDPOINT}/${TENANT_ID}`;
    this.state.urlSafe = this.sanitizer['bypassSecurityTrustResourceUrl'](URL);

    _debugX(JobsQueueBoardViewV1.getClassName(), `ngOnInit`, {
      this_state: this.state
    });
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    //
  }


  static route() {
    const RET_VAL = {
      path: 'jobs-queue-board',
      children: [
        {
          path: '',
          component: JobsQueueBoardViewV1,
          data: {
            name: 'Dashboard',
            componentInRoleTable: JobsQueueBoardViewV1.getClassName(),
            description: 'Enables access to Jobs & Queues Dashboard view',
            actions: []
          }
        },
      ],
      data: {
        breadcrumb: 'jobs_and_queues_board_view_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }

}
