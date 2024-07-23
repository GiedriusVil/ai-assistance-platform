/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
} from 'client-shared-services';

import {
  BaseViewV1,
} from 'client-shared-views';

import {
  OUTLETS,
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AiTranslationServicesServiceV1
} from 'client-services';

import {
  AiTranslationPromptDeleteModalV1,
  AiTranslationPromptSaveModalV1,
  AiTranslationPromptImportModalV1,
} from '../components';


@Component({
  selector: 'aiap-ai-translation-prompts-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class AiTranslationPromptsViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'AiTranslationPromptsViewV1';
  }

  @ViewChild('aiTranslationPromptDeleteModalV1') aiTranslationPromptDeleteModalV1: AiTranslationPromptDeleteModalV1;
  @ViewChild('aiTranslationPromptSaveModalV1') aiTranslationPromptSaveModalV1: AiTranslationPromptSaveModalV1;
  @ViewChild('aiTranslationPromptImportModalV1') aiTranslationPromptImportModalV1: AiTranslationPromptImportModalV1;

  outlet = OUTLETS.tenantCustomizer;

  aiTranslationServiceId: string;
  aiTranslationService: any = undefined;

  state: any = {
    isLoading: false,
    queryType: DEFAULT_TABLE.AI_TRANSLATION_PROMPTS_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_TRANSLATION_PROMPTS_V1.SORT
  }


  constructor(
    private aiTranslationServicesService: AiTranslationServicesServiceV1,
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToQueryParams();
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AiTranslationPromptsViewV1.getClassName(), 'subscribeToQueryParams', { params: params });
        this.aiTranslationServiceId = params.aiTranslationServiceId;
        this.loadAiTranslationService();
      });
  }

  loadAiTranslationService() {
    const QUERY = {
      filter: {
        id: this.aiTranslationServiceId,
      },
      sort: {
        field: 'id',
        direction: 'desc'
      },
      pagination: {
        page: 1,
        size: 1,
      }
    };
    _debugX(AiTranslationPromptsViewV1.getClassName(), `loadAiTranslationService`, { QUERY });
    this.state.isLoading = true;
    this.aiTranslationServicesService.findManyByQuery(QUERY)
      .pipe(
        catchError((error: any) => this.handleFindAiTranslationServicesByQueryError(error))
      ).subscribe((response: any) => {
        _debugX(AiTranslationPromptsViewV1.getClassName(), `loadAiTranslationService`, { response });
        this.aiTranslationService = response?.items?.[0];
        this.state.isLoading = false;
      })
  }

  handleFindAiTranslationServicesByQueryError(error: any) {
    _errorX(AiTranslationPromptsViewV1.getClassName(), `handleFindAiTranslationServicesByQueryError`, { error });
    this.state.isLoading = false;

    return of();
  }
}
