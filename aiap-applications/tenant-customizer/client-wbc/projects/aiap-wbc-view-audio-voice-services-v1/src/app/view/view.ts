/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

import {
  AudioVoiceServicesSaveModalV1,
  AudioVoiceServicesDeleteModalV1,
  AudioVoiceServicesImportModalV1
} from '../components';

@Component({
  selector: 'aiap-audio-voice-services-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AudioVoiceServicesViewV1 extends BaseView implements OnInit, AfterViewInit {

  static getClassName() {
    return 'AudioVoiceServicesViewV1';
  }

  @ViewChild('aiapAudioVoiceServicesSaveModal') audioVoiceServicesSaveModal: AudioVoiceServicesSaveModalV1;
  @ViewChild('aiapAudioVoiceServicesDeleteModal') audioVoiceServicesDeleteModal: AudioVoiceServicesDeleteModalV1;
  @ViewChild('aiapAudioVoiceServicesImportModal') aiapAudioVoiceServicesImportModal: AudioVoiceServicesImportModalV1;



  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    queryType: DEFAULT_TABLE.TOPIC_MODELING_V1.TYPE,
    defaultSort: DEFAULT_TABLE.TOPIC_MODELING_V1.SORT,
    search: '',
  };

  constructor(
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }


  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowSaveModal(event: any = undefined): void {
    _debugX(AudioVoiceServicesViewV1.getClassName(), `handleShowSavePlaceEvent`,
      {
        event,
      });

    this.audioVoiceServicesSaveModal.show(event?.value?.id);
  }

  handleShowRemovePlaceEvent(event: any = undefined): void {
    _debugX(AudioVoiceServicesViewV1.getClassName(), `handleShowRemovePlaceEvent`,
      {
        event,
      });

    this.audioVoiceServicesDeleteModal.show(event);
  }

  handleShowImportPlaceEvent(event: any = undefined): void {
    _debugX(AudioVoiceServicesViewV1.getClassName(), `handleShowImportPlaceEvent`,
      {
        event,
      });

    this.aiapAudioVoiceServicesImportModal.show();
  }

  handleSearchClearEvent(event: any) {
    _debugX(AudioVoiceServicesViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(AudioVoiceServicesViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }
}
