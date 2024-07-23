/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';

import {
  L_MODULE_EXAMPLE_AUTHORIZATION_SERVICE,
  L_MODULE_EXAMPLE_COMPLEX_ACTION,
  L_MODULE_EXAMPLE_SIMPLE_ACTION,
  L_MODULE_EXAMPLE_SLACK_COMPONENT,
  L_MODULE_EXAMPLE_SOE_MIDDLEWARE,
  L_MODULE_EXAMPLE_MS_TEAMS_CARD
} from './lambda-module-examples';

@Component({
  selector: 'aiap-lambda-module-help-modal-v1',
  templateUrl: './lambda-module-help-modal-v1.html',
  styleUrls: ['./lambda-module-help-modal-v1.scss']
})
export class LambdaModuleHelpModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LambdaModuleHelpModalV1';
  }

  markdown = `
  ----
  ### ${this.translateService.instant('lambda_module_help_modal_v1.markdown.hot_keys')}
  - Command + s -> ${this.translateService.instant('lambda_module_help_modal_v1.markdown.command_save')}
  - Command + <???> -> ${this.translateService.instant('lambda_module_help_modal_v1.markdown.command_compile')}
  - Command + <???> -> ${this.translateService.instant('lambda_module_help_modal_v1.markdown.command_show_errors')}
  ----
  ### ${this.translateService.instant('lambda_module_help_modal_v1.markdown.lambda_module_types')}

  ${L_MODULE_EXAMPLE_AUTHORIZATION_SERVICE}

  ${L_MODULE_EXAMPLE_SIMPLE_ACTION}

  ${L_MODULE_EXAMPLE_COMPLEX_ACTION}
  
  ${L_MODULE_EXAMPLE_SLACK_COMPONENT}

  ${L_MODULE_EXAMPLE_SOE_MIDDLEWARE}
  
  ${L_MODULE_EXAMPLE_MS_TEAMS_CARD}
  `;

  constructor(
    private eventsService: EventsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show() {
    this.superShow();
  }

}
