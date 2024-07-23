/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  HTMLDependenciesServiceV1,
} from 'client-services';

const HTML_TAG = 'aiap-wbc-form-rule-outcome-v2';

@Component({
  selector: 'aiap-wbc-form-root-rule-outcome-v2',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AiapWbcFormRuleOutcomeV2 implements OnInit, OnChanges {

  static getClassName() {
    return `AiapWbcFormRuleOutcomeV2`;
  }

  static getElementTag() {
    return HTML_TAG;
  }

  @Input() context: any = {};
  @Output() contextChange = new EventEmitter<any>();

  @Input() value: any = {};
  @Output() valueChange = new EventEmitter<any>();

  loadedInputs = {
    context: false,
    value: false,
  };

  constructor(
    private environmentService: EnvironmentServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    let wbc: any;
    try {

      if (changes?.context) {
        this.loadedInputs.context = true;
      }
      if (changes?.value) {
        this.loadedInputs.value = true;
      }

      wbc = changes?.context?.currentValue?.wbc;
      _debugW(AiapWbcFormRuleOutcomeV2.getClassName(), 'ngOnChanges', { changes });

      if (
        !lodash.isEmpty(wbc?.host) &&
        !lodash.isEmpty(wbc?.path) &&
        !lodash.isEmpty(wbc?.tag)
      ) {
        this.environmentService.addWbcDetailsToEnvironment(wbc);
        this.loadHTMLDependencies();
      }
    } catch (error) {
      _errorW(AiapWbcFormRuleOutcomeV2.getClassName(), 'ngOnChanges', { wbc });

      throw error;
    }
  }

  handleContextChange(event: any) {
    _debugW(AiapWbcFormRuleOutcomeV2.getClassName(), 'handleContextChange',
      {
        event: event,
        this_value: this.value,
      });
    this.contextChange.emit(event);
  }

  handleValueChange(event: any) {
    _debugW(AiapWbcFormRuleOutcomeV2.getClassName(), 'handleValueChange',
      {
        event: event,
        this_value: this.value,
      });
    this.valueChange.emit(event);
  }

  isReady() {
    const DEPENDENCIES_LOADED = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    const INPUTS_LOADED = this.loadedInputs.context && this.loadedInputs.value;
    const RET_VAL = DEPENDENCIES_LOADED && INPUTS_LOADED;

    return RET_VAL;
  }

  private elCSSLinkId() {
    return AiapWbcFormRuleOutcomeV2.getElementTag();
  }

  private async loadHTMLDependencies() {
    const EL_CSS_LINK_ID = this.elCSSLinkId();
    const CLIENT_WBC_URL_BASE = `${this.environmentService.getHost()}/client-wbc/${EL_CSS_LINK_ID}`;
    const CLIENT_WBC_STYLES_URL = `${CLIENT_WBC_URL_BASE}/styles.css`;
    _debugW(AiapWbcFormRuleOutcomeV2.getClassName(), 'loadHTMLDependencies', {
      EL_CSS_LINK_ID,
      CLIENT_WBC_URL_BASE,
      CLIENT_WBC_STYLES_URL,
    });

    this.htmlDependenciesService.loadCSSDependency(EL_CSS_LINK_ID, CLIENT_WBC_STYLES_URL);
  }
}
