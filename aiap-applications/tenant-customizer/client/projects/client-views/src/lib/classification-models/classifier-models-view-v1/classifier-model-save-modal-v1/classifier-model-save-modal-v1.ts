/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  CLASSIFIER_MESSAGES,
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
  ClassifierServiceV1,
} from 'client-services';

import {
  ClassifierModelSaveAiServicesTab,
  ClassifierModelSaveClassifierTab,
  ClassifierModelSaveWareTab,
} from '.';

import { BaseModal } from 'client-shared-views';

@Component({
  selector: 'aca-classifier-model-save-modal',
  templateUrl: './classifier-model-save-modal-v1.html',
  styleUrls: ['./classifier-model-save-modal-v1.scss'],
})
export class ClassifierModelSaveModal extends BaseModal implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'ClassifierModelSaveModal';
  }

  @ViewChild('aiServicesTab', { static: true }) aiServicesTab: ClassifierModelSaveAiServicesTab;
  @ViewChild('wareTab', { static: true }) wareTab: ClassifierModelSaveWareTab;
  @ViewChild('classifierTab', { static: true }) classifierTab: ClassifierModelSaveClassifierTab;

  _selections = {
    aiServices: [],
    aiServicesSelected: [],
    fallbackAiServices: [],
    fallbackAiServiceSelected: undefined,
  };

  _model: any = {
    id: undefined,
    name: undefined,
    trainerUrl: undefined,
    serviceUrl: undefined,
    suggestionsEnabled: false,
    aiServices: [],
    fallbackAiService: undefined,
    classifier: {
      type: 'multinomial_nb',
      configuration: {
        model_type: 'skl',
        vectorizer: 'tfidf',
        base_model: 'multinomial_nb',
        preprocessor: 'multinomial_nb',
      }
    },
    ware: {
      onMultipleChoices: 'SUGGEST',
      threshold: {
        classifier: {
          top: 0.3,
          range: 0.2,
          min: 0.1,
          quantity: 5
        },
        aiService: {
          top: 0.3,
          range: 0.2,
          min: 0.1,
        },
        intent: {
          top: 0.3,
          range: 0.2,
          min: 0.1,
          quantity: 3
        },
      },
      disambiguation: {
        threshold: 0.1,
        aiServiceId: undefined,
        aiSkillId: undefined,
      },
      debug: true,
      prompts: {
        multiChoiceSuggestion: {
          en: 'Please select a topic you are interested in!'
        }
      }
    }
  }
  selections: any = lodash.cloneDeep(this._selections);
  model: any = lodash.cloneDeep(this._model);

  constructor(
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
    private classifierService: ClassifierServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  loadFormData(id: any) {
    _debugX(ClassifierModelSaveModal.getClassName(), 'loadFormData', { id });
    this.eventsService.loadingEmit(true);
    this.classifierService.retrieveModelFormData(id).pipe(
      catchError((error) => this.handleRetrieveModelFormDataError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(ClassifierModelSaveModal.getClassName(), 'loadFormData', { response });
      const MODEL = response?.model;

      if (
        !lodash.isEmpty(MODEL)
      ) {
        this.model = lodash.cloneDeep(MODEL);
      }

      const AI_SERVICES = response?.aiServices?.items;
      const AI_SKILLS = response?.aiSkills?.items;

      this.appendAiSkillsToAiServices(AI_SERVICES, AI_SKILLS);

      this.setFallbackAiServices(AI_SERVICES);
      this.setAiServices(AI_SERVICES);

      _debugX(ClassifierModelSaveModal.getClassName(), 'loadFormData', {
        this_selections: this.selections,
        AI_SERVICES: AI_SERVICES,
        AI_SKILLS: AI_SKILLS,
      });
      this.superShow();
      this.eventsService.loadingEmit(false);
    });
  }

  private appendAiSkillsToAiServices(aiServices: any, aiSkills: any) {
    const MAP_AI_SERVICE_BY_ID = {};
    try {
      if (
        !lodash.isEmpty(aiServices) &&
        lodash.isArray(aiServices) &&
        !lodash.isEmpty(aiSkills) &&
        lodash.isArray(aiSkills)
      ) {
        for (const AI_SERVICE of aiServices) {
          const TMP_AI_SERVICE_ID = AI_SERVICE?.id;
          if (
            !lodash.isEmpty(TMP_AI_SERVICE_ID)
          ) {
            MAP_AI_SERVICE_BY_ID[TMP_AI_SERVICE_ID] = AI_SERVICE;
          }
        }
      }
      for (const AI_SKILL of aiSkills) {
        const TMP_AI_SERVICE_ID = AI_SKILL?.aiServiceId;
        const TMP_AI_SKILL_ID = AI_SKILL?.id;
        if (
          !lodash.isEmpty(TMP_AI_SERVICE_ID) &&
          !lodash.isEmpty(TMP_AI_SKILL_ID)
        ) {
          const TMP_AI_SERVICE = MAP_AI_SERVICE_BY_ID[TMP_AI_SERVICE_ID];
          if (
            !lodash.isEmpty(TMP_AI_SERVICE)
          ) {
            if (
              lodash.isEmpty(TMP_AI_SERVICE?.aiSkills) ||
              !lodash.isArray(TMP_AI_SERVICE?.aiSkills)
            ) {
              TMP_AI_SERVICE.aiSkills = [];
            }
            TMP_AI_SERVICE.aiSkills.push(AI_SKILL);
          }
        }
      }
    } catch (error: any) {
      _debugX(ClassifierModelSaveModal.getClassName(), 'appendAiSkillsToAiServices', { error });
      throw error;
    }
  }

  private setFallbackAiServices(services: any) {
    try {
      const SELECTIONS = lodash.cloneDeep(this.selections);
      const AI_SERVICES = this.transformAiServicesIntoDropdownItems(services);
      _debugX(ClassifierModelSaveModal.getClassName(), 'setFallbackAiServices', {
        SELECTIONS,
        AI_SERVICES,
      });
      const AI_SERVICE_FALLBACK = this.model?.fallbackAiService;
      for (const AI_SERVICE of AI_SERVICES) {
        if (
          !lodash.isEmpty(AI_SERVICE?.value?.serviceId) &&
          !lodash.isEmpty(AI_SERVICE_FALLBACK?.serviceId) &&
          lodash.isEqual(
            {
              serviceId: AI_SERVICE?.value?.serviceId,
              aiSkillId: !lodash.isEmpty(AI_SERVICE?.value?.skillId) ? AI_SERVICE?.value?.skillId : undefined,
            },
            {
              serviceId: AI_SERVICE_FALLBACK.serviceId,
              aiSkillId: !lodash.isEmpty(AI_SERVICE_FALLBACK.aiSkillId) ? AI_SERVICE_FALLBACK.aiSkillId : undefined,
            }
          )
        ) {
          SELECTIONS.fallbackAiServiceSelected = AI_SERVICE;
          AI_SERVICE.selected = true;
        }
        SELECTIONS.fallbackAiServices.push(AI_SERVICE);
      }
      this.selections = SELECTIONS;
    } catch (error: any) {
      _errorX(ClassifierModelSaveAiServicesTab.getClassName(), 'setFallbackAiServices',
        {
          error: error,
          this_selections: this.selections,
        });
      throw error;
    }
  }

  private setAiServices(services: any) {
    const SELECTIONS = lodash.cloneDeep(this.selections);
    const AI_SERVICES = this.transformAiServicesIntoDropdownItems(services);
    _debugX(ClassifierModelSaveModal.getClassName(), 'setAiServices',
      {
        SELECTIONS,
        AI_SERVICES,
      });

    const MODEL_AI_SERVICES = this.model?.aiServices;
    for (const AI_SERVICE of AI_SERVICES) {
      if (
        !lodash.isEmpty(AI_SERVICE?.value) &&
        !lodash.isEmpty(MODEL_AI_SERVICES) &&
        lodash.isArray(MODEL_AI_SERVICES)
      ) {
        const TMP_ITEM = MODEL_AI_SERVICES.find((item: any) => {
          let exists = false;
          if (
            !lodash.isEmpty(AI_SERVICE?.value?.serviceId) &&
            !lodash.isEmpty(item?.serviceId) &&
            lodash.isEqual(
              {
                serviceId: item?.serviceId,
                skillId: !lodash.isEmpty(item?.skillId) ? item?.skillId : undefined,
              },
              {
                serviceId: AI_SERVICE?.value?.serviceId,
                skillId: !lodash.isEmpty(AI_SERVICE?.value?.skillId) ? AI_SERVICE?.value?.skillId : undefined,
              }
            )
          ) {
            exists = true;
          }
          return exists;
        });
        if (
          TMP_ITEM
        ) {
          AI_SERVICE.selected = true;
          AI_SERVICE.value.regex = TMP_ITEM.regex;
          AI_SERVICE.value.displayNameValues = TMP_ITEM.displayNameValues;
          SELECTIONS.aiServicesSelected.push(AI_SERVICE);
        }
      }
      SELECTIONS.aiServices.push(AI_SERVICE);
    }
    this.selections = SELECTIONS;
  }

  private transformAiServicesIntoDropdownItems(aiServices: any) {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(aiServices) &&
      lodash.isArray(aiServices)
    ) {
      for (const AI_SERVICE of aiServices) {
        const TMP_AI_SERVICE_ID = AI_SERVICE?.id;
        const TMP_AI_SERVICE_NAME = AI_SERVICE?.name;
        if (
          lodash.isEmpty(TMP_AI_SERVICE_ID) ||
          lodash.isEmpty(TMP_AI_SERVICE_NAME)
        ) {
          continue;
        }

        let tmpItem: any;
        let dropdownItems;
        switch (AI_SERVICE?.type) {
          case 'WA':
            dropdownItems = this.transformIbmWaV1AiServiceIntoDropdownItems(AI_SERVICE);
            break;
          case 'WA_V2':
            dropdownItems = this.transformIbmWaV2AiServiceIntoDropdownItems(AI_SERVICE);
            break;
          case 'AWS_LEX_V2':
            dropdownItems = this.transformAwsLexV2AiServiceIntoDropdownItems(AI_SERVICE);
            break;
          case 'CHAT_GPT_V3':
            tmpItem = {
              content: `${TMP_AI_SERVICE_NAME}`,
              value: {
                serviceId: TMP_AI_SERVICE_ID,
              }
            };
            RET_VAL.push(tmpItem);
            break;
          default:
            break;
        }
        if (
          !lodash.isEmpty(dropdownItems) &&
          lodash.isArray(dropdownItems)
        ) {
          RET_VAL.push(...dropdownItems);
        }
      }
    }
    return RET_VAL;
  }

  private transformIbmWaV1AiServiceIntoDropdownItems(aiService: any) {
    const RET_VAL = [];
    let tmpAiServiceId: any;
    let tmpAiServiceName: any;

    let tmpAiSkills: any;
    let tmpAiSkillName: any;
    let tmpAiSkillId: any;
    let tmpAiSkillExternalId: any;
    let tmpItem: any;

    try {
      tmpAiServiceId = aiService?.id;
      tmpAiServiceName = aiService?.name;

      tmpAiSkills = aiService?.aiSkills;
      if (
        !lodash.isEmpty(tmpAiSkills) &&
        lodash.isArray(tmpAiSkills)
      ) {
        for (const AI_SKILL of tmpAiSkills) {
          tmpAiSkillId = AI_SKILL?.id;
          tmpAiSkillName = AI_SKILL?.name;
          tmpAiSkillExternalId = AI_SKILL?.external?.workspace_id;
          if (
            lodash.isEmpty(tmpAiSkillId) ||
            lodash.isEmpty(tmpAiSkillName) ||
            lodash.isEmpty(tmpAiSkillExternalId)
          ) {
            continue;
          }
          tmpItem = {
            content: `${tmpAiServiceName} / ${tmpAiSkillName}`,
            value: {
              serviceId: tmpAiServiceId,
              skillId: tmpAiSkillId,
              skillExternalId: tmpAiSkillExternalId,
            }
          };
          RET_VAL.push(tmpItem);
        }
      }
      return RET_VAL;
    } catch (error) {
      _errorX(ClassifierModelSaveModal.getClassName(), 'transformIbmWaV1AiServiceIntoDropdownItems',
        {
          error,
        });

      throw error;
    }
  }

  private transformIbmWaV2AiServiceIntoDropdownItems(aiService: any) {
    const RET_VAL = [];
    let tmpAiServiceId: any;
    let tmpAiServiceName: any;

    let tmpAiSkills: any;
    let tmpAiSkillName: any;
    let tmpAiSkillId: any;
    let tmpAiSkillExternalId: any;
    let tmpItem: any;

    try {
      tmpAiServiceId = aiService?.id;
      tmpAiServiceName = aiService?.name;

      tmpAiSkills = aiService?.aiSkills;
      if (
        !lodash.isEmpty(tmpAiSkills) &&
        lodash.isArray(tmpAiSkills)
      ) {
        for (const AI_SKILL of tmpAiSkills) {
          tmpAiSkillId = AI_SKILL?.id;
          tmpAiSkillName = AI_SKILL?.name;
          tmpAiSkillExternalId = AI_SKILL?.external?.skill_id;
          if (
            lodash.isEmpty(tmpAiSkillId) ||
            lodash.isEmpty(tmpAiSkillName) ||
            lodash.isEmpty(tmpAiSkillExternalId)
          ) {
            continue;
          }
          tmpItem = {
            content: `${tmpAiServiceName} / ${tmpAiSkillName}`,
            value: {
              serviceId: tmpAiServiceId,
              skillId: tmpAiSkillId,
              skillExternalId: tmpAiSkillExternalId,
            }
          };
          RET_VAL.push(tmpItem);
        }
      }
      return RET_VAL;
    } catch (error) {
      _errorX(ClassifierModelSaveModal.getClassName(), 'transformIbmWaV2AiServiceIntoDropdownItems',
        {
          error,
        });

      throw error;
    }
  }

  private transformAwsLexV2AiServiceIntoDropdownItems(aiService: any) {
    const RET_VAL = [];
    let tmpAiServiceId: any;
    let tmpAiServiceName: any;

    let tmpAiSkills: any;
    let tmpAiSkillName: any;
    let tmpAiSkillId: any;
    let tmpItem: any;

    try {
      tmpAiServiceId = aiService?.id;
      tmpAiServiceName = aiService?.name;

      tmpAiSkills = aiService?.aiSkills;
      if (
        !lodash.isEmpty(tmpAiSkills) &&
        lodash.isArray(tmpAiSkills)
      ) {
        for (const AI_SKILL of tmpAiSkills) {
          tmpAiSkillId = AI_SKILL?.id;
          tmpAiSkillName = AI_SKILL?.name;
          if (
            lodash.isEmpty(tmpAiSkillId) ||
            lodash.isEmpty(tmpAiSkillName)
          ) {
            continue;
          }
          tmpItem = {
            content: `${tmpAiServiceName} / ${tmpAiSkillName}`,
            value: {
              serviceId: tmpAiServiceId,
              skillId: tmpAiSkillId
            }
          };
          RET_VAL.push(tmpItem);
        }
      }
      return RET_VAL;
    } catch (error) {
      _errorX(ClassifierModelSaveModal.getClassName(), 'transformAwsLexV2AiServiceIntoDropdownItems',
        {
          error,
        });

      throw error;
    }
  }


  private handleRetrieveModelFormDataError(error: any) {
    _errorX(ClassifierModelSaveModal.getClassName(), 'handleRetrieveModelFormDataError',
      {
        error,
      });

    this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.FIND_ONE_BY_ID);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private handleSaveModelError(error: any) {
    _errorX(ClassifierModelSaveModal.getClassName(), 'handleSaveModelError',
      {
        error,
      });

    this.notificationService.showNotification(CLASSIFIER_MESSAGES.ERROR.SAVE_ONE);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private sanitizedModel() {
    const RET_VAL = lodash.cloneDeep(this.model);
    const SANITIZED_AI_SERVICES = [];
    const SELECTED_FALLBACK_AI_SERVICE_SKILL = this.selections?.fallbackAiServiceSelected;
    if (
      this.selections?.aiServicesSelected &&
      this.selections?.aiServicesSelected.length > 0
    ) {
      for (const AI_SERVICE of this.selections.aiServicesSelected) {
        if (
          !lodash.isEmpty(AI_SERVICE?.value?.serviceId)
        ) {
          const TMP_SANITIZED_AI_SERVICE: any = {
            serviceId: AI_SERVICE?.value?.serviceId,
            regex: AI_SERVICE?.value?.regex,
            displayNameValues: AI_SERVICE?.value?.displayNameValues,
          };

          if (
            !lodash.isEmpty(AI_SERVICE?.value?.skillId)
          ) {
            TMP_SANITIZED_AI_SERVICE.skillId = AI_SERVICE?.value?.skillId;
          }
          if (
            !lodash.isEmpty(AI_SERVICE?.value?.skillExternalId)
          ) {
            TMP_SANITIZED_AI_SERVICE.skillExternalId = AI_SERVICE?.value?.skillExternalId;
          }
          SANITIZED_AI_SERVICES.push(TMP_SANITIZED_AI_SERVICE);
        }
      }
      RET_VAL.aiServices = SANITIZED_AI_SERVICES;
    }
    if (
      !lodash.isEmpty(SELECTED_FALLBACK_AI_SERVICE_SKILL?.value?.serviceId)
    ) {
      const AI_SERVICE_FALLBACK: any = {
        serviceId: SELECTED_FALLBACK_AI_SERVICE_SKILL?.value?.serviceId,
      };
      if (
        !lodash.isEmpty(SELECTED_FALLBACK_AI_SERVICE_SKILL?.value?.skillId)
      ) {
        AI_SERVICE_FALLBACK.aiSkillId = SELECTED_FALLBACK_AI_SERVICE_SKILL?.value?.skillId;
      }
      if (
        !lodash.isEmpty(SELECTED_FALLBACK_AI_SERVICE_SKILL?.value?.skillExternalId)
      ) {
        AI_SERVICE_FALLBACK.skillExternalId = SELECTED_FALLBACK_AI_SERVICE_SKILL?.value?.skillExternalId;
      }
      RET_VAL.fallbackAiService = AI_SERVICE_FALLBACK;
    }

    RET_VAL.ware = this.wareTab.getValue();
    RET_VAL.classifier = this.classifierTab.getValue();
    return RET_VAL;
  }

  save() {
    const MODEL = this.sanitizedModel();
    _debugX(ClassifierModelSaveModal.getClassName(), 'save',
      {
        MODEL,
      });

    this.classifierService.saveOne(MODEL).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleSaveModelError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(ClassifierModelSaveModal.getClassName(), 'save',
        {
          response,
        });

      this.eventsService.loadingEmit(false);
      this.notificationService.showNotification(CLASSIFIER_MESSAGES.SUCCESS.SAVE_ONE);
      this.eventsService.filterEmit(undefined);
      this.close();
    });
  }

  handleApplicationFlagClickEvent(event: any) {
    _debugX(ClassifierModelSaveModal.getClassName(), 'handleApplicationFlagClickEvent',
      {
        event,
      });

    this.model.suggestionsEnabled = !this.model.suggestionsEnabled;
  }

  show(id: string) {
    _debugX(ClassifierModelSaveModal.getClassName(), 'show',
      {
        id,
      });

    this.model = lodash.cloneDeep(this._model);
    this.selections = lodash.cloneDeep(this._selections);
    this.loadFormData(id);
  }

  isInvalid() {
    const RET_VAL =
      !this.wareTab.isValid() ||
      !this.classifierTab.isValid() ||
      !this.aiServicesTab.isValid();

    return RET_VAL;
  }
}
