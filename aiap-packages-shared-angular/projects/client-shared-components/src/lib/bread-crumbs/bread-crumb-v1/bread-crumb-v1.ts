/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
// import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';

import {
  _debugX,
  _errorX,
  OUTLETS,
} from 'client-shared-utils';

import {
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BreadcrumbItem,
} from '../bread-crumb-item-interface';

const ROUTE_DATA_BREADCRUMB_NAME = 'breadcrumb';
const HOME_ROUTE = 'main-view';

@Component({
  selector: 'aca-breadcrumb',
  templateUrl: './bread-crumb-v1.html',
  styleUrls: ['./bread-crumb-v1.scss'],
})
export class BreadcrumbV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'BreadcrumbV1';
  }

  @Input() outlet: string = OUTLETS.default;

  private _destroyed$: Subject<void> = new Subject();

  breadcrumbItems: BreadcrumbItem[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateHelperServiceV1,
  ) { }

  ngOnInit(): void {
    //
  }

  async ngAfterViewInit(): Promise<any> {
    this.breadcrumbItems = await this.createBreadcrumbs(this.activatedRoute.root);
    _debugX(BreadcrumbV1.getClassName(), 'ngAfterViewInit',
      {
        this_breadcrumbItems: this.breadcrumbItems,
      });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    breadcrumbRoute: string[] = [],
    breadcrumbItems: BreadcrumbItem[] = [],
  ): BreadcrumbItem[] {
    try {
      const ROUTES_CHILDREN: ActivatedRoute[] = route.children;
      _debugX(BreadcrumbV1.getClassName(), 'ngAfterViewInit', {
        route,
        breadcrumbRoute,
        breadcrumbItems,
      });
      if (
        ROUTES_CHILDREN.length === 0
      ) {
        const LAST_ITEM: any = lodash.last(breadcrumbItems);
        if (
          LAST_ITEM
        ) {
          LAST_ITEM.current = 'true';
          delete LAST_ITEM.route;
        }
        return breadcrumbItems;
      }
      for (const ROUTE_CHILDREN of ROUTES_CHILDREN) {
        const CHILD_ROUTE_PATH: string = ROUTE_CHILDREN.snapshot.routeConfig.path;
        if (
          !lodash.isEmpty(CHILD_ROUTE_PATH)
        ) {
          breadcrumbRoute.push(CHILD_ROUTE_PATH);
          if (
            !lodash.isEqual(CHILD_ROUTE_PATH, HOME_ROUTE)
          ) {
            const BREADCRUMB_NAME: string = ROUTE_CHILDREN.snapshot.data[ROUTE_DATA_BREADCRUMB_NAME];
            if (
              !lodash.isEmpty(BREADCRUMB_NAME)
            ) {
              const BREADCRUMB_CONTENT = this.translateService.instant(BREADCRUMB_NAME);
              _debugX(BreadcrumbV1.getClassName(), 'createBreadcrumbs',
                {
                  BREADCRUMB_CONTENT: BREADCRUMB_CONTENT,
                  BREADCRUMB_NAME: BREADCRUMB_NAME,
                });

              const BREADCRUMB: BreadcrumbItem = {
                content: BREADCRUMB_CONTENT,
                route: [
                  {
                    outlets: {
                      [this.outlet]: lodash.cloneDeep(breadcrumbRoute)
                    }
                  }
                ]
              };
              breadcrumbItems.push(BREADCRUMB);
            }
          }
        }
        return this.createBreadcrumbs(ROUTE_CHILDREN, breadcrumbRoute, breadcrumbItems);
      }
    } catch (error) {
      _errorX(BreadcrumbV1.getClassName(), 'createBreadcrumbs',
        {
          error,
        });
      throw error;
    }
  }
}
