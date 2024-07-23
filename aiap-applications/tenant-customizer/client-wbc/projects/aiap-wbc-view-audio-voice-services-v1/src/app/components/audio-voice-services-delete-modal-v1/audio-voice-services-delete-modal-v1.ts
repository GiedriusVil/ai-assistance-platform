/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseModal
} from 'client-shared-views';

import {
  AUDIO_VOICE_SERVICES_MESSAGES,
} from 'client-utils';

import {
  AudioVoiceServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-audio-voice-services-delete-modal-v1',
  templateUrl: './audio-voice-services-delete-modal-v1.html',
  styleUrls: ['./audio-voice-services-delete-modal-v1.scss']
})
export class AudioVoiceServicesDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AudioVoiceServicesDeleteModalV1';
  }

  _ids: Array<any> = [];
  ids: any = lodash.cloneDeep(this._ids);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private audioVoiceService: AudioVoiceServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    //
  }

  delete() {
    _debugX(AudioVoiceServicesDeleteModalV1.getClassName(), 'delete',
      {
        this_ids: this.ids,
      });

    this.audioVoiceService.deleteManyByIds(this.ids)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleDeleteManyByIdsErrors(error)),
        takeUntil(this._destroyed$)
      ).subscribe((response: any) => {
        _debugX(AudioVoiceServicesDeleteModalV1.getClassName(), 'delete',
          {
            response,
          });

        this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.SUCCESS.DELETE_MANY_BY_IDS);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(undefined);
      });
  }

  handleDeleteManyByIdsErrors(error: any) {
    _debugX(AudioVoiceServicesDeleteModalV1.getClassName(), 'handleDeleteManyByIdsErrors',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.ERROR.DELETE_MANY_BY_IDS);
    return of();
  }

  show(ids: any) {
    _debugX(AudioVoiceServicesDeleteModalV1.getClassName(), 'show',
      {
        ids,
      });

    if (
      !lodash.isEmpty(ids)
    ) {
      this.ids = lodash.cloneDeep(ids);
      this.superShow();
    } else {
      this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.ERROR.MISSING_MANY);
    }
  }

}
