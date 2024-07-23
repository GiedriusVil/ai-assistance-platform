/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  NgZone,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseViewWithWbcLoaderV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-ai-search-and-analysis-collections-view-v1',
  templateUrl: './ai-search-and-analysis-collections-view-v1.html',
  styleUrls: ['./ai-search-and-analysis-collections-view-v1.scss']
})
export class AiSearchAndAnalysisCollectionsViewV1 extends BaseViewWithWbcLoaderV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'AiSearchAndAnalysisCollectionsViewV1';
  }

  constructor(
    protected ngZone: NgZone,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected sessionService: SessionServiceV1,
  ) {
    super(
      ngZone,
      router,
      activatedRoute,
      sessionService,
    );
  }

  ngOnInit(): void {
    this.loadWBCView(AiSearchAndAnalysisCollectionsViewV1.getClassName());
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'ai-search-and-analysis-collections',
      children: [
        ...children,
        {
          path: '',
          component: AiSearchAndAnalysisCollectionsViewV1,
          data: {
            component: AiSearchAndAnalysisCollectionsViewV1.getClassName(),
          }
        },
      ],
      data: {
        breadcrumb: 'ai_search_and_analysis_collections_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
