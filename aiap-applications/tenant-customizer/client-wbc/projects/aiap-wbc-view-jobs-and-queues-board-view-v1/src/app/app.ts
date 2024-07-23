/*
  © Copyright IBM Corporation 2023. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import * as lodash from 'lodash';

import {
  TranslateService,
} from '@ngx-translate/core';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EnvironmentServiceV1,
  LocalStorageServiceV1,
  TranslateHelperServiceV1,
  HTMLDependenciesServiceV1,
  ConfigServiceV1,
} from 'client-shared-services';

import {
  BaseAppWbcViewV1,
} from 'client-shared-views';

const HTML_TAG = 'aiap-wbc-view-jobs-and-queues-board-view-v1';

@Component({
  selector: HTML_TAG,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class WbcViewJobsAndQueuesBoardViewV1 extends BaseAppWbcViewV1 implements OnInit, OnChanges {

  static getClassName() {
    return `WbcViewJobsAndQueuesBoardViewV1`;
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
    protected configService: ConfigServiceV1,
  ) {
    super(
      environmentService,
      localStorageService,
      translateHelperService,
      translateService,
    );
  }

  ngOnInit(): void {
    //
  }

  async ngOnChanges(changes: SimpleChanges) {
    let wbc: any;
    try {
      wbc = changes?.context?.currentValue?.wbc;
      _debugW(WbcViewJobsAndQueuesBoardViewV1.getClassName(), 'ngOnChanges',
        {
          changes,
        });

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

        this.environmentService.setActivatedRoute(this.context?.activatedRoute);
        this.environmentService.setEnvironmentByWBCConfiguration(wbc);
        this.environmentService.setNgZone(this.context?.ngZone);
        this.environmentService.setRouter(this.context?.router);
        await this.configService.load();
        await this.loadHTMLDependencies();
      }
    } catch (error) {
      _errorW(WbcViewJobsAndQueuesBoardViewV1.getClassName(), 'ngOnChanges',
        {
          wbc,
        });

      throw error;
    }
  }

  protected isReady() {
    const RET_VAL = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    return RET_VAL;
  }

  protected elCSSLinkId() {
    const RET_VAL = WbcViewJobsAndQueuesBoardViewV1.getElementTag();
    return RET_VAL;
  }

  protected async loadCSSDependency(cssLinkId: string, styleUrl: string) {
    await this.htmlDependenciesService.loadCSSDependency(cssLinkId, styleUrl);
  }
}
