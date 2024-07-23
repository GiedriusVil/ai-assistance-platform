/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { of } from 'rxjs';
import {
  catchError,
  takeUntil,
  tap
} from 'rxjs/operators';

import * as lodash from 'lodash';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  NotificationService
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1
} from 'client-shared-views';


import {
  AudioVoiceServiceV1,
} from 'client-services';

import { AUDIO_VOICE_SERVICES_MESSAGES } from 'client-utils';

@Component({
  selector: 'aiap-audio-voice-services-save-modal-v1',
  templateUrl: './audio-voice-services-save-modal-v1.html',
  styleUrls: ['./audio-voice-services-save-modal-v1.scss'],
})
export class AudioVoiceServicesSaveModalV1 extends BaseModalV1 implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'AudioVoiceServicesSaveModalV1';
  }

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _audioVoiceServiceData = {
    refId: undefined,
    name: undefined,
    type: undefined,
    configurations: undefined
  };

  _state = {
    serviceTypes: [],
    serviceTypeSelected: undefined,
    configurations: undefined
  }

  state: any = lodash.cloneDeep(this._state);

  audioVoiceServiceData: any = lodash.cloneDeep(this._audioVoiceServiceData);


  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private audioVoiceService: AudioVoiceServiceV1,
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Audio Voice Service (Configuration)';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code'];
    this.jsonEditorOptions.mode = 'code';
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  loadFormData(id: any) {
    this.state = lodash.cloneDeep(this._state);
    this.eventsService.loadingEmit(true);
    this.audioVoiceService.retrieveAudioVoiceFormData(id).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.sendErrorNotification(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AudioVoiceServicesSaveModalV1.getClassName(), 'loadFormData',
        {
          response,
        });

      const AUDIO_VOICE_DATA = response?.audioVoiceService;
      if (
        lodash.isEmpty(AUDIO_VOICE_DATA)
      ) {
        this.audioVoiceServiceData = lodash.cloneDeep(this._audioVoiceServiceData);
      } else {
        this.audioVoiceServiceData = AUDIO_VOICE_DATA;
      }
      this.state = lodash.cloneDeep(this.state);
      this.refreshEditorData(response);
      this._refreshServiceTypes();
      this.eventsService.loadingEmit(false);
      this.superShow();
      _debugX(AudioVoiceServicesSaveModalV1.getClassName(), 'loadFormData',
        {
          this_state: this.state,
          this_audioVoiceData: this.audioVoiceServiceData,
        });
    });
  }

  _sanitizedAudioVoiceService() {
    const RET_VAL = lodash.cloneDeep(this.audioVoiceServiceData);
    const SERVICE_TYPE_SELECTED = this.state?.serviceTypeSelected?.content;
    const CONFIGURATIONS = this.jsonEditor.get();
    RET_VAL.type = SERVICE_TYPE_SELECTED;
    RET_VAL.configurations = CONFIGURATIONS;
    return RET_VAL;
  }

  private sendErrorNotification(error: any) {
    _errorX(AudioVoiceServicesSaveModalV1.getClassName(), 'loadData',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  refreshEditorData(audioVoiceServiceData) {
    const CONFIGURATIONS = audioVoiceServiceData?.configurations;
    if (lodash.isEmpty(CONFIGURATIONS)) {
      this.jsonEditor.writeValue(undefined);
    }
    _debugX(AudioVoiceServicesSaveModalV1.getClassName(), 'refreshEditorData',
      {
        this_state: this.state,
      });

  }

  save() {
    const SANITIZED_SERVICE = this._sanitizedAudioVoiceService();
    this.audioVoiceService.saveOne(SANITIZED_SERVICE).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleSaveFormError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AudioVoiceServicesSaveModalV1.getClassName(), 'save',
        {
          response,
        });

      this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.SUCCESS.SAVE_ONE);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(undefined);
      this.close();
    });
  }

  isSaveDisabled() {
    let retVal = true;
    const REF_ID = this.audioVoiceServiceData?.refId;
    const NAME = this.audioVoiceServiceData?.name;
    const TYPE = this.state?.serviceTypeSelected;
    if (
      !lodash.isEmpty(REF_ID) &&
      !lodash.isEmpty(NAME) &&
      !lodash.isEmpty(TYPE)
    ) {
      retVal = false;
    }
    return retVal;
  }


  handleSaveFormError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  private _refreshServiceTypes() {
    const MODULE_TYPES = [
      {
        content: 'STT_HTTP',
        selected: false,
      },
      {
        content: 'TTS_HTTP',
        selected: false,
      },
      {
        content: 'STT_IBM_CLOUD',
        selected: false,
      },
      {
        content: 'TTS_IBM_CLOUD',
        selected: false,
      },
    ];

    for (const TYPE of MODULE_TYPES) {
      TYPE.selected = this.audioVoiceServiceData?.type === TYPE?.content;
      this.state.serviceTypes.push(TYPE);
      if (
        TYPE.selected
      ) {
        this.state.serviceTypeSelected = TYPE;
      }
    }
  }

  show(id: string) {
    _debugX(AudioVoiceServicesSaveModalV1.getClassName(), 'show',
      {
        id,
      });

    this.loadFormData(id);
  }
}
