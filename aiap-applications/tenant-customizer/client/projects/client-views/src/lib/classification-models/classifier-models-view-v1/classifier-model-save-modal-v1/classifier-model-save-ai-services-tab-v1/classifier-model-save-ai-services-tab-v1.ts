/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  ClassifierModelAddAiSkillModal,
} from './classifier-model-add-ai-skill-modal-v1/classifier-model-add-ai-skill-modal-v1';

@Component({
  selector: 'aca-classifier-model-save-ai-services-tab',
  templateUrl: './classifier-model-save-ai-services-tab-v1.html',
  styleUrls: ['./classifier-model-save-ai-services-tab-v1.scss'],
})
export class ClassifierModelSaveAiServicesTab implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassifierModelSaveAiServicesTab';
  }

  private _destroyed$: Subject<void> = new Subject();

  @ViewChild('classifierModelAddAiSkillModal', { static: true }) classifierModelAddAiSkillModal: ClassifierModelAddAiSkillModal;


  @Input() value;

  @Input() selections: any;
  @Output() selectionsChange = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleAddAiServicesEvent(event: any) {
    _debugX(ClassifierModelSaveAiServicesTab.getClassName(), 'handleAddAiServicesEvent',
      {
        event,
      });

    this.classifierModelAddAiSkillModal.show();
  }

  handleAiServiceRemoveEvent(event: any) {
    _debugX(ClassifierModelSaveAiServicesTab.getClassName(), 'handleAiServiceRemoveEvent',
      {
        event,
      });

    const SELECTIONS = lodash.cloneDeep(this.selections);

    const SELECTION_AI_SERVICES = SELECTIONS?.aiServices;

    const OLD_AI_SKILLS_SELECTED: Array<any> = SELECTIONS.aiServicesSelected;
    const NEW_AI_SKILLS_SELECTED: Array<any> = [];
    if (
      lodash.isArray(OLD_AI_SKILLS_SELECTED) &&
      !lodash.isEmpty(OLD_AI_SKILLS_SELECTED)
    ) {
      for (const AI_SKILL_SELECTED of OLD_AI_SKILLS_SELECTED) {
        const AI_SERVICE_ID = AI_SKILL_SELECTED?.value?.serviceId;
        const AI_SKILL_ID = AI_SKILL_SELECTED?.value?.skillId;
        const AI_SKILL_EXTERNAL_ID = AI_SKILL_SELECTED?.value?.skillExternalId;

        const DELETE_AI_SERVICE_ID = event?.value?.serviceId;
        const DELETE_AI_SKILL_ID = event?.value?.skillId;
        const DELETE_AI_SKILL_EXTERNAL_ID = event?.value?.skillExternalId;
        if (
          !(
            !lodash.isEmpty(AI_SERVICE_ID) &&
            !lodash.isEmpty(AI_SKILL_ID) &&
            !lodash.isEmpty(AI_SKILL_EXTERNAL_ID) &&
            !lodash.isEmpty(DELETE_AI_SERVICE_ID) &&
            !lodash.isEmpty(DELETE_AI_SKILL_ID) &&
            !lodash.isEmpty(DELETE_AI_SKILL_EXTERNAL_ID) &&
            AI_SERVICE_ID === DELETE_AI_SERVICE_ID &&
            AI_SKILL_ID === DELETE_AI_SKILL_ID &&
            AI_SKILL_EXTERNAL_ID === DELETE_AI_SKILL_EXTERNAL_ID
          )
        ) {
          NEW_AI_SKILLS_SELECTED.push(AI_SKILL_SELECTED);
        } else {
          if (
            lodash.isArray(SELECTION_AI_SERVICES)
          ) {
            const SELECTION = SELECTION_AI_SERVICES.find((item: any) => {
              const TMP_AI_SERVICE_ID = item?.value?.serviceId;
              const TMP_AI_SKILL_ID = item?.value?.skillId;
              const TMP_AI_SKILL_EXTERNAL_ID = item?.value?.skillExternalId;
              const CONDITION = !(
                !lodash.isEmpty(AI_SERVICE_ID) &&
                !lodash.isEmpty(AI_SKILL_ID) &&
                !lodash.isEmpty(AI_SKILL_EXTERNAL_ID) &&
                !lodash.isEmpty(TMP_AI_SERVICE_ID) &&
                !lodash.isEmpty(TMP_AI_SKILL_ID) &&
                !lodash.isEmpty(TMP_AI_SKILL_EXTERNAL_ID) &&
                AI_SERVICE_ID === TMP_AI_SERVICE_ID &&
                AI_SKILL_ID === TMP_AI_SKILL_ID &&
                AI_SKILL_EXTERNAL_ID === TMP_AI_SKILL_EXTERNAL_ID
              );
              return CONDITION;
            });
            if (
              SELECTION
            ) {
              SELECTION.selected = false;
            }
          }
        }
      }
      SELECTIONS.aiServicesSelected = NEW_AI_SKILLS_SELECTED;
    }
    this.selectionsChange.emit(SELECTIONS);
  }

  getValue() {
    //
  }

  isValid() {
    try {
      if (
        !lodash.isEmpty(this.selections?.aiServicesSelected)
      ) {
        for (const AI_SERVICE_SELECTED of this.selections.aiServicesSelected) {
          if (
            lodash.isEmpty(AI_SERVICE_SELECTED.value.displayNameValues)
          ) {
            continue
          }
          if (
            AI_SERVICE_SELECTED.value.displayNameValues.some((item: any) => lodash.isEmpty(item.language)) ||
            AI_SERVICE_SELECTED.value.displayNameValues.some((item: any) => lodash.isEmpty(item.value))
          ) {
            return false;
          }
          const UNIQUE_VALUES = new Set(AI_SERVICE_SELECTED.value.displayNameValues.map((item: any) => item.language));
          if (
            UNIQUE_VALUES.size < AI_SERVICE_SELECTED.value.displayNameValues.length
          ) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      _errorX(ClassifierModelSaveAiServicesTab.getClassName(), 'isValid', { error });
      throw error;
    }
  }

  updateSelection(event) {
    _debugX(ClassifierModelSaveAiServicesTab.getClassName(), 'updateSelection', { event });

    if (lodash.isArray(event)) {
      this.selections.aiServicesSelected = event;
    } else {
      this.selections.fallbackAiServiceSelected = event?.item;
    }
  }

}
