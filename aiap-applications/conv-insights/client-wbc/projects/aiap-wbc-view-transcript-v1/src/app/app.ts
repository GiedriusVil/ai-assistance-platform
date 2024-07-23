/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import * as lodash from 'lodash';

import { TranslateService } from '@ngx-translate/core';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EnvironmentServiceV1,
  LocalStorageServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseAppWbcViewV1,
} from 'client-shared-views';

import {
  HTMLDependenciesServiceV1,
} from 'client-services';

const HTML_TAG = 'aiap-wbc-view-transcript-v1';

@Component({
  selector: 'aiap-wbc-view-root-transcript-v1',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AiapWbcViewTranscriptV1 extends BaseAppWbcViewV1 implements OnInit, OnChanges {

  static getClassName() {
    return `AiapWbcViewTranscriptV1`;
  }

  static getElementTag() {
    return HTML_TAG;
  }

  @Input() context: any;
  @Output() contextChange = new EventEmitter<any>();

  @Input() params: any;
  @Output() paramsChange = new EventEmitter<any>();

  constructor(
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    protected environmentService: EnvironmentServiceV1,
    protected localStorageService: LocalStorageServiceV1,
    protected translateHelperService: TranslateHelperServiceV1,
    protected translateService: TranslateService,
  ) {
    super(
      environmentService,
      localStorageService,
      translateHelperService,
      translateService,
    );
  }

  async ngOnInit() {
    //
  }

  async ngOnChanges(changes: SimpleChanges) {
    let wbc: any;
    try {
      wbc = changes?.context?.currentValue?.wbc;
      _debugW(AiapWbcViewTranscriptV1.getClassName(), 'ngOnChanges', { changes });
      if (
        !lodash.isEmpty(wbc?.host) &&
        !lodash.isEmpty(wbc?.path) &&
        !lodash.isEmpty(wbc?.tag)
      ) {
        await this.initTranslations({
          app: wbc?.tag,
          host: wbc?.host,
          path: `/client-wbc/${wbc?.tag}/assets/i18n`,
        });
        await this.initiliseEnvironmentServiceV1(
          this.context,
          wbc,
        );
        await this.loadHTMLDependencies();
      }
    } catch (error) {
      _errorW(AiapWbcViewTranscriptV1.getClassName(), 'ngOnChanges', { wbc });
      throw error;
    }
  }

  protected isReady() {
    const RET_VAL = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    return RET_VAL;
  }

  protected elCSSLinkId() {
    const RET_VAL = AiapWbcViewTranscriptV1.getElementTag();
    return RET_VAL;
  }

  protected async loadCSSDependency(cssLinkId: string, styleUrl: string) {
    await this.htmlDependenciesService.loadCSSDependency(cssLinkId, styleUrl);
  }

}
