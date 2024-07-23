/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';

import {
  AiSkillsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-ai-skill-dialog-tree-modal-v1',
  templateUrl: './ai-skill-dialog-tree-modal-v1.html',
  styleUrls: ['./ai-skill-dialog-tree-modal-v1.scss']
})
export class AiSkillDialogTreeModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiSkillDialogTreeModalV1';
  }

  _state: any = {
    aiSkill: null,
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private aiSkillsService: AiSkillsServiceV1,
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


  close() {
    super.close();
    this.eventsService.filterEmit(null);
  }

  show(params: any) {
    _debugX(AiSkillDialogTreeModalV1.getClassName(), 'show', { params });
    if (
      params?.aiSkill
    ) {
      const NEW_STATE = lodash.cloneDeep(this.state);
      NEW_STATE.aiSkill = params?.aiSkill;
      this.state = NEW_STATE;
    }
    this.superShow();
  }

}
