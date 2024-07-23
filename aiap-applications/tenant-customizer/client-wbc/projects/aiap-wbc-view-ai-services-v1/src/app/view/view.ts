/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import { WbcLocationServiceV1 } from 'client-shared-services';

import { BaseView } from 'client-shared-views';

import { OUTLETS } from 'client-utils';

import {
  AiServiceDeleteModalV1,
  AiServiceSaveModalV1,
  AiServiceImportModalV1,
} from '../components';


@Component({
  selector: 'aiap-ai-services-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AiServicesViewV1 extends BaseView implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiServicesViewV1';
  }

  @ViewChild('aiServiceDeleteModal') aiServiceDeleteModal: AiServiceDeleteModalV1;
  @ViewChild('aiServiceSaveModal') aiServiceSaveModal: AiServiceSaveModalV1;
  @ViewChild('aiServiceImportModal') aiServiceImportModal: AiServiceImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  constructor(
    private wbcLocationService: WbcLocationServiceV1,
  ) {
    super();
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowSavePlaceEvent(event: any) {
    _debugX(AiServicesViewV1.getClassName(), 'showAiServiceSaveModal', { event });
    const AI_SERVICE = event?.value;
    this.aiServiceSaveModal.show(AI_SERVICE);
  }

  handleShowAiSkillsPlaceEvent(event: any) {
    const NAVIGATION: any = {};
    let pullConfiguration: boolean = true;
    try {
      _debugX(AiServicesViewV1.getClassName(), 'handleShowAiSkillsPlaceEvent', { event });
      if (
        lodash.isEmpty(event?.pullConfiguration)
      ) {
        pullConfiguration = false;
      }
      NAVIGATION.extras = {
        queryParams: {
          aiServiceId: event?.id,
          assistantId: event?.assistantId,
          pullConfiguration: pullConfiguration,
        }
      };
      NAVIGATION.path = '(tenantCustomizer:main-view/aiservices/aiservice)'
      _debugX(AiServicesViewV1.getClassName(), 'handleShowAiSkillsPlaceEvent', { event, NAVIGATION });
      this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(AiServicesViewV1.getClassName(), 'handleShowAiSkillsPlaceEvent', { event, NAVIGATION });
      throw error;
    }
  }

  handleShowImportModalEvent(event: any) {
    _debugX(AiServicesViewV1.getClassName(), 'showAiServiceSaveModal', { event });
    this.aiServiceImportModal.show();
  }

  handleShowRemovePlaceEvent(ids: any) {
    _debugX(AiServicesViewV1.getClassName(), `handleShowRemovePlaceEvent`, { ids });
    this.aiServiceDeleteModal.show(ids);
  }

  showAiServiceSaveModal(aiService: any = undefined) {
    _debugX(AiServicesViewV1.getClassName(), 'showAiServiceSaveModal', { aiService });
    this.aiServiceSaveModal.show(aiService);
  }
}
