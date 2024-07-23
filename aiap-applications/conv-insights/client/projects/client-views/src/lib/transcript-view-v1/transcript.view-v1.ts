/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';

import {
  IViewStateV1,
  _debugX,
  _errorX,
  retrieveViewWBCConfigurationFromSession
} from 'client-shared-utils';

import {
  EventsServiceV1,
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

@Component({
  selector: 'aiap-transcript-view-v1',
  templateUrl: './transcript.view-v1.html',
  styleUrls: ['./transcript.view-v1.scss']
})
export class TranscriptViewV1 extends BaseView implements OnInit {

  static getClassName() {
    return 'TranscriptViewV1';
  }

  _state: IViewStateV1 = {
    activatedRoute: undefined,
    router: undefined,
    ngZone: undefined,
    wbc: {
      host: undefined,
      path: undefined,
      tag: undefined,
    },
  }
  state = lodash.cloneDeep(this._state);

  _params = {};
  params = lodash.cloneDeep(this._params);

  constructor(
    private sessionService: SessionServiceV1,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadWBCView();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  url() {
    const RET_VAL = this.state?.wbc?.host + this.state?.wbc?.path;
    return RET_VAL;
  }

  applicationLoadingText() {
    return `Waiting for application ${this.state?.wbc?.tag} to load from ${this.state?.wbc?.host}${this.state?.wbc?.path}!`;
  }

  loadWBCView() {
    try {
      const SESSION = this.sessionService.getSession();
      const WBC = retrieveViewWBCConfigurationFromSession(SESSION, TranscriptViewV1.getClassName());
      const STATE_NEW = lodash.cloneDeep(this.state);
      STATE_NEW.wbc = WBC;
      STATE_NEW.activatedRoute = this.activatedRoute;
      STATE_NEW.router = this.router;
      STATE_NEW.ngZone = this.ngZone;
      _debugX(TranscriptViewV1.getClassName(), `loadConfiguration`, {
        STATE_NEW,
        SESSION,
        WBC,
      });
      this.state = STATE_NEW;
    } catch (error) {
      _errorX(TranscriptViewV1.getClassName(), 'loadConfiguration', { error });
      throw error;
    }
  }


  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'transcript-view-v1',
      children: [
        ...children,
        {
          path: '',
          component: TranscriptViewV1,
          data: {
            name: 'transcript_view_v1.name',
            component: TranscriptViewV1.getClassName(),
            description: 'transcript_view_v1.description',
          }
        }
      ],
      data: {
        breadcrumb: 'transcript_view_v1.breadcrumb'
        
      }
    };
    return RET_VAL;
  }

}
