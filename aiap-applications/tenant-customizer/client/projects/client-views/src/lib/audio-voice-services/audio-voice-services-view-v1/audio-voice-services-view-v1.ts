/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, NgZone, OnInit } from '@angular/core';

import * as lodash from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';

import {
  _debugX,
  _errorX,
  retrieveViewWBCConfigurationFromSession
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseView, BaseViewWithWbcLoaderV1
} from 'client-shared-views';

@Component({
  selector: 'aiap-audio-voice-services-view-v1',
  templateUrl: './audio-voice-services-view-v1.html',
  styleUrls: ['./audio-voice-services-view-v1.scss']
})
export class AudioVoiceServicesViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit {

  static getClassName() {
    return 'AudioVoiceServicesViewV1';
  }

  _state: any = {
    activatedRoute: undefined,
    router: undefined,
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
    protected sessionService: SessionServiceV1,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected ngZone: NgZone
  ) {
    super(
        ngZone,
        router,
        activatedRoute,
        sessionService,
    );
  }

  ngOnInit(): void {
    this.loadWBCView(AudioVoiceServicesViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  applicationLoadingText() {
    return `Waiting for application ${this.state?.wbc?.tag} to load from ${this.state?.wbc?.host}${this.state?.wbc?.path}!`;
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'audio-voice-services-view-v1',
      children: [
        ...children,
        {
          path: '',
          component: AudioVoiceServicesViewV1,
          data: {
            component: AudioVoiceServicesViewV1.getClassName(),
          }
        },
      ],
      data: {
        breadcrumb: 'audio_voice_services_view_v1.name',
      }
    }
    return RET_VAL;
  }
}
