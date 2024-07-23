/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

import lodash from 'lodash';

import {
  _debugX,
  _errorX,
  OUTLETS,
} from 'client-shared-utils';

import {
  EnvironmentServiceV1,
  TranslateHelperServiceV1,
  WbcLocationServiceV1,
} from 'client-shared-services';

import {
  BreadcrumbItem,
} from '../bread-crumb-item-interface';

const ROUTE_DATA_BREADCRUMB_NAME = 'breadcrumb';
const HOME_ROUTE = 'main-view';

@Component({
  selector: 'aiap-bread-crumb-v2',
  templateUrl: './bread-crumb-v2.html',
  styleUrls: ['./bread-crumb-v2.scss'],
})
export class BreadCrumbV2 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'BreadCrumbV2';
  }

  @Input() outlet: string = OUTLETS.default;
  @ViewChild('breadcrumbItemTemplate') breadcrumbItemTemplate

  private _destroyed$: Subject<void> = new Subject();

  breadcrumbItems: BreadcrumbItem[];

  constructor(
    private environmentService: EnvironmentServiceV1,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateHelperServiceV1,
    private wbcLocationService: WbcLocationServiceV1,
  ) { }

  ngOnInit(): void {
    //
  }

  ngAfterViewInit(): void {
    let tmpActivatedRoute: ActivatedRoute = this.activatedRoute;
    if (
      this.environmentService.getActivatedRoute()
    ) {
      tmpActivatedRoute = this.environmentService.getActivatedRoute();
    }

    this.breadcrumbItems = this.createBreadcrumbs(tmpActivatedRoute.root);
    _debugX(BreadCrumbV2.getClassName(), 'ngAfterViewInit',
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
      _debugX(BreadCrumbV2.getClassName(), 'ngAfterViewInit', {
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
              _debugX(BreadCrumbV2.getClassName(), 'createBreadcrumbs',
                {
                  BREADCRUMB_CONTENT: BREADCRUMB_CONTENT,
                  BREADCRUMB_NAME: BREADCRUMB_NAME,
                });

              const BREADCRUMB: BreadcrumbItem = {
                content: BREADCRUMB_CONTENT,
                template: this.breadcrumbItemTemplate,
                path: this.getBreadcrumbPath(lodash.cloneDeep(breadcrumbRoute)),
              };
              breadcrumbItems.push(BREADCRUMB);
            }
          }
        }
        return this.createBreadcrumbs(ROUTE_CHILDREN, breadcrumbRoute, breadcrumbItems);
      }
    } catch (error) {
      _errorX(BreadCrumbV2.getClassName(), 'createBreadcrumbs',
        {
          error,
        });

      throw error;
    }
  }

  private getBreadcrumbPath(childRoutes: string[]): string {
    const RET_VAL = `(${this.outlet}:${childRoutes.join('/')})`;
    return RET_VAL;
  }

  protected navigateByUrl(data: any) {
    const NAVIGATION: any = {};
    try {
      NAVIGATION.path = data?.path;
      NAVIGATION.extras = {};
      _debugX(BreadCrumbV2.getClassName(), 'navigateByUrl', { NAVIGATION });
      this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras)
    } catch (error) {
      _errorX(BreadCrumbV2.getClassName(), 'navigateByUrl', { error, NAVIGATION });
    }
  }
}
