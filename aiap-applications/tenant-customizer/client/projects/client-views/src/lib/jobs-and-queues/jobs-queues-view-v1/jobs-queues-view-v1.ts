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
  selector: 'jobs-queues-view-v1',
  templateUrl: './jobs-queues-view-v1.html',
  styleUrls: ['./jobs-queues-view-v1.scss']
})
export class JobsQueuesViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'JobsQueuesViewV1';
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
    this.loadWBCView(JobsQueuesViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'jobs-queues',
      children: [
        ...children,
        {
          path: '',
          component: JobsQueuesViewV1,
          data: {
            breadcrumb: 'Jobs and Queues',
            name: 'Jobs and Queues',
            component: JobsQueuesViewV1.getClassName(),
            description: 'Enables access to Jobs and Queues view',
            actions: [
              {
                name: 'Allow queue insertion',
                component: 'jobs-queues.view.add',
                description: 'Allows the creation of new Jobs & Queues configurations',
              },
              {
                name: 'Allow queue removal',
                component: 'jobs-queues.view.delete',
                description: 'Allows deletion of existing Jobs & Queues configurations',
              },
              {
                name: 'Allow queue edit',
                component: 'jobs-queues.view.edit',
                description: 'Allows the ability to edit existing Jobs & Queues configurations',
              },
              {
                name: 'Allow queue import',
                component: 'jobs-queues.view.import',
                description: 'Allows the import of Jobs & Queues configurations',
              },
              {
                name: 'Allow queue export',
                component: 'jobs-queues.view.export',
                description: 'Allows the export of Jobs & Queues configurations',
              }
            ]
          }
        }
      ],
      data: {
        breadcrumb: 'jobs_and_queues_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
