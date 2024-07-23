/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';


import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  AUDIO_VOICE_SERVICES_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  AudioVoiceServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-audio-voice-services-import-modal-v1',
  templateUrl: './audio-voice-services-import-modal-v1.html',
  styleUrls: ['./audio-voice-services-import-modal-v1.scss'],
})
export class AudioVoiceServicesImportModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AudioVoiceServicesImportModalV1';
  }

  @Input() files = new Set();

  uploadButtonDisabled = true;

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private audioVoiceService: AudioVoiceServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {
    //
  }

  show(): void {
    this.clearFileContainer();
    this.uploadButtonDisabled = true;
    this.superShow();
  }

  async import() {
    const FILE = ramda.path(['file'], this.files.values().next().value);
    _debugX(AudioVoiceServicesImportModalV1.getClassName(), 'import', { FILE });
    this.audioVoiceService.importFromFile(FILE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleImportManyFromFile(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AudioVoiceServicesImportModalV1.getClassName(), 'import',
        {
          response
        });

      this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.SUCCESS.IMPORT_MANY_FROM_FILE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(null);
      this.close();
    });
  }

  handleImportManyFromFile(error: any) {
    _errorX(AudioVoiceServicesImportModalV1.getClassName(), 'handleImportManyFromFile',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.ERROR.IMPORT_MANY_FROM_FILE);
    return of();
  }

  clearFileContainer(): void {
    this.files.clear();
  }

  onFileAdd(event: any): void {
    if (!lodash.isEmpty(event)) {
      this.uploadButtonDisabled = false;
    } else {
      this.uploadButtonDisabled = true;
    }
  }

}
