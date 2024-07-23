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

const HTML_TAG = 'aiap-wbc-field-template-v1';

@Component({
  selector: 'aiap-wbc-field-root-template-v1',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AiapWbcFieldTemplateV1 implements OnInit, OnChanges {

  static getClassName() {
    return `AiapWbcFieldTemplateV1`;
  }

  static getElementTag() {
    return HTML_TAG;
  }

  @Input() context: any;
  @Output() contextChange = new EventEmitter<any>();

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  constructor(
    private environmentService: EnvironmentServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    let wbc: any;
    try {
      wbc = changes?.context?.currentValue?.wbc;
      _debugW(AiapWbcFieldTemplateV1.getClassName(), 'ngOnChanges', { changes });
      if (
        !lodash.isEmpty(wbc?.host) &&
        !lodash.isEmpty(wbc?.path) &&
        !lodash.isEmpty(wbc?.tag)
      ) {
        this.environmentService.setEnvironmentByWBCConfiguration(wbc);
        this.loadHTMLDependencies();
      }
    } catch (error) {
      _errorW(AiapWbcFieldTemplateV1.getClassName(), 'ngOnChanges', { wbc });
      throw error;
    }
  }

  handleValueChange(event: any) {
    _debugW(
      AiapWbcFieldTemplateV1.getClassName(),
      'handleValueChange',
      {
        event: event,
        this_value: this.value,
      });

    this.valueChange.emit(event);
  }

  isReady() {
    const RET_VAL = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    return RET_VAL;
  }

  private elCSSLinkId() {
    return AiapWbcFieldTemplateV1.getElementTag();
  }

  private async loadHTMLDependencies() {
    const EL_CSS_LINK_ID = this.elCSSLinkId();
    const CLIENT_WBC_URL_BASE = `${this.environmentService.getHost()}/client-wbc/${EL_CSS_LINK_ID}`;
    const CLIENT_WBC_STYLES_URL = `${CLIENT_WBC_URL_BASE}/styles.css`;
    _debugW(AiapWbcFieldTemplateV1.getClassName(), 'loadHTMLDependencies', {
      EL_CSS_LINK_ID,
      CLIENT_WBC_URL_BASE,
      CLIENT_WBC_STYLES_URL,
    });
    this.htmlDependenciesService.loadCSSDependency(EL_CSS_LINK_ID, CLIENT_WBC_STYLES_URL);
  }
}
