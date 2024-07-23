/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  NgZone,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseViewWithWbcLoaderV1,
} from 'client-shared-views';

@Component({
  selector: 'jobs-queue-board-view-v1',
  templateUrl: './jobs-queue-board-view-v1.html',
  styleUrls: ['./jobs-queue-board-view-v1.scss']
})
export class JobsAndQueuesBoardViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'JobsAndQueuesBoardViewV1';
  }

  constructor(
      protected ngZone: NgZone,
      protected router: Router,
      protected activatedRoute: ActivatedRoute,
      protected sessionService: SessionServiceV1,
  ) {
    super(
        ngZone,
        router,
        activatedRoute,
        sessionService,
    );
  }

  ngOnInit(): void {
    this.loadWBCView(JobsAndQueuesBoardViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'jobs-queue-board',
      children: [
        ...children,
        {
          path: '',
          component: JobsAndQueuesBoardViewV1,
          data: {
            name: 'Dashboard',
            componentInRoleTable: JobsAndQueuesBoardViewV1.getClassName(),
            description: 'Enables access to Jobs & Queues Dashboard view',
            actions: []
          }
        },
      ],
      data: {
        breadcrumb: 'jobs_and_queues_board_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
