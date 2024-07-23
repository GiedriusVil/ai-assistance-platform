/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  BaseModal,
} from 'client-shared-views';

@Component({
  selector: 'aca-classifier-model-add-ai-skill-modal',
  templateUrl: './classifier-model-add-ai-skill-modal-v1.html',
  styleUrls: ['./classifier-model-add-ai-skill-modal-v1.scss']
})
export class ClassifierModelAddAiSkillModal extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassifierModelAddAiSkillModal';
  }

  @Input() selections: any;
  @Output() selectionsChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show() {
    _debugX(ClassifierModelAddAiSkillModal.getClassName(), 'show', {});
    this.superShow();
  }

  handleAddAiSkillsEvent(event: any) {
    _debugX(ClassifierModelAddAiSkillModal.getClassName(), 'handleAddAiSkillsEvent', { event });
    this.close();
  }

  updateSelection(event) {
    _debugX(ClassifierModelAddAiSkillModal.getClassName(), 'updateSelection', { event });
    if (lodash.isArray(event)) {
      this.selections.aiServicesSelected = event;
    } else {
      this.selections.fallbackAiServiceSelected = event?.item;
    }
  }

}
