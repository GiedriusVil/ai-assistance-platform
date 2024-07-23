/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class ClassificationCategoriesServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'ClassificationCategoriesServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  private _classificationCatalogHostUrl() {
    return `${this._hostUrl()}/api/v1/classification-catalog`;
  }

  private _segmentsHostUrl() {
    return `${this._classificationCatalogHostUrl()}/segments`;
  }

  private _familiesHostUrl() {
    return `${this._classificationCatalogHostUrl()}/families`;
  }

  private _classesHostUrl() {
    return `${this._classificationCatalogHostUrl()}/classes`;
  }

  private _subClassesHostUrl() {
    return `${this._classificationCatalogHostUrl()}/sub-classes`;
  }

  findManyByQuery(type: string, query: any): Observable<any> {
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'findManyByQuery', { type, query });
    if (
      lodash.isString(type) &&
      !lodash.isEmpty(type)
    ) {
      switch (type) {
        case 'SEGMENT':
          return this.findSegmentsByQuery(query);
        case 'FAMILY':
          return this.findFamiliesByQuery(query);
        case 'CLASS':
          return this.findClassesByQuery(query);
        case 'SUB_CLASS':
          return this.findSubClassesByQuery(query);
        default:
          break;
      }
    }
    const ACA_ERROR = {
      type: 'SYSTEM_ERROR',
      message: 'Provided parameter type - must be one of following values -> [SEGMENT, FAMILY, CLASS, SUB_CLASS]!'
    }
    return throwError(ACA_ERROR);
  }

  private findSegmentsByQuery(query: any): Observable<any> {
    const QUERY: any = {
      filter: {
        search: query?.filter?.segmentSearch,
        catalogId: query?.filter?.catalogId,
      },
      pagination: query?.pagination,
      sort: query?.sort,
    }
    const REQUEST_URL = `${this._segmentsHostUrl()}/find-many-by-query`;
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'findSegmentsByQuery', { REQUEST_URL, QUERY });
    return this.httpClient.post(REQUEST_URL, QUERY, this.getAuthHeaders());
  }

  private findFamiliesByQuery(query: any): Observable<any> {
    const QUERY: any = {
      filter: {
        search: query?.filter?.familySearch,
        catalogId: query?.filter?.catalogId,
        segmentId: query?.filter?.segmentId,
      },
      pagination: query?.pagination,
      sort: query?.sort,
    };
    const REQUEST_URL = `${this._familiesHostUrl()}/find-many-by-query`;
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'findFamiliesByQuery', { REQUEST_URL, QUERY });
    return this.httpClient.post(REQUEST_URL, QUERY, this.getAuthHeaders());
  }

  private findClassesByQuery(query: any): Observable<any> {
    const QUERY: any = {
      filter: {
        search: query?.filter?.classSearch,
        catalogId: query?.filter?.catalogId,
        segmentId: query?.filter?.segmentId,
        familyId: query?.filter?.familyId,
      },
      pagination: query?.pagination,
      sort: query?.sort,
    };
    const REQUEST_URL = `${this._classesHostUrl()}/find-many-by-query`;
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'findClassesByQuery', { REQUEST_URL, QUERY });
    return this.httpClient.post(REQUEST_URL, QUERY, this.getAuthHeaders());
  }

  private findSubClassesByQuery(query: any): Observable<any> {
    const QUERY: any = {
      filter: {
        search: query?.filter?.subClassSearch,
        catalogId: query?.filter?.catalogId,
        segmentId: query?.filter?.segmentId,
        familyId: query?.filter?.familyId,
        classId: query?.filter?.classId
      },
      pagination: query?.pagination,
      sort: query?.sort,
    };
    const REQUEST_URL = `${this._subClassesHostUrl()}/find-many-by-query`;
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'findSubClassesByQuery', { REQUEST_URL, QUERY });
    return this.httpClient.post(REQUEST_URL, QUERY, this.getAuthHeaders());
  }

  deleteOne(category: any) {
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'deleteOne', { category });
    const CATEGORY_TYPE = ramda.path(['type'], category);
    if (
      lodash.isString(CATEGORY_TYPE) &&
      !lodash.isEmpty(CATEGORY_TYPE)
    ) {
      switch (CATEGORY_TYPE) {
        case 'SEGMENT':
          return this.deleteSegment(category);
        case 'FAMILY':
          return this.deleteFamily(category);
        case 'CLASS':
          return this.deleteClass(category);
        case 'SUB_CLASS':
          return this.deleteSubClass(category);
        default:
          break;
      }
    }
    const ACA_ERROR = {
      type: 'SYSTEM_ERROR',
      message: 'Provided parameter type - must be one of following values -> [SEGMENT, FAMILY, CLASS, SUB_CLASS]!'
    }
    return throwError(ACA_ERROR);
  }

  private deleteSegment(segment: any) {
    const REQUEST_URL = `${this._segmentsHostUrl()}/delete-one`;
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'deleteSegment', { REQUEST_URL, segment });
    const RET_VAL = this.httpClient.post(REQUEST_URL, segment, this.getAuthHeaders());
    return RET_VAL;
  }

  private deleteFamily(family: any) {
    const REQUEST_URL = `${this._familiesHostUrl()}/delete-one`;
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'deleteFamily', { REQUEST_URL, family });
    const RET_VAL = this.httpClient.post(REQUEST_URL, family, this.getAuthHeaders());
    return RET_VAL;
  }

  private deleteClass(clazz: any) {
    const REQUEST_URL = `${this._classesHostUrl()}/delete-one`;
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'deleteClass', { REQUEST_URL, clazz });
    const RET_VAL = this.httpClient.post(REQUEST_URL, clazz, this.getAuthHeaders());
    return RET_VAL;
  }

  private deleteSubClass(subClass: any) {
    const REQUEST_URL = `${this._subClassesHostUrl()}/delete-one`;
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'subClass', { REQUEST_URL, subClass });
    const RET_VAL = this.httpClient.post(REQUEST_URL, subClass, this.getAuthHeaders());
    return RET_VAL;
  }

  saveOne(category: any) {
    _debugX(ClassificationCategoriesServiceV1.getClassName(), 'saveOne', { category });
    const CATEGORY_TYPE = ramda.path(['type'], category);

    if (
      lodash.isString(CATEGORY_TYPE) &&
      !lodash.isEmpty(CATEGORY_TYPE)
    ) {
      switch (CATEGORY_TYPE) {
        case 'SEGMENT':
          return this.__saveSegment(category);
        case 'FAMILY':
          return this.__saveFamily(category);
        case 'CLASS':
          return this.__saveClass(category);
        case 'SUB_CLASS':
          return this.__saveSubClass(category);
        default:
          break;
      }
    }

    const ACA_ERROR = {
      type: 'SYSTEM_ERROR',
      message: 'Provided parameter type - must be one of following values -> [SEGMENT, FAMILY, CLASS, SUB_CLASS]!'
    }
    return throwError(ACA_ERROR);
  }

  private __saveSegment(segment: any) {
    const REQUEST_URL = `${this._segmentsHostUrl()}`;
    _debugX(ClassificationCategoriesServiceV1.getClassName(), '__saveSegment', { REQUEST_URL, segment });
    const RET_VAL = this.httpClient.post(REQUEST_URL, segment, this.getAuthHeaders());
    return RET_VAL;
  }

  private __saveFamily(family: any) {
    const RET_VAL = this.httpClient
      .post(this._familiesHostUrl(), family, this.getAuthHeaders());
    return RET_VAL;
  }

  private __saveClass(clazz: any) {
    const RET_VAL = this.httpClient
      .post(this._classesHostUrl(), clazz, this.getAuthHeaders());
    return RET_VAL;
  }

  private __saveSubClass(subClass: any) {
    const RET_VAL = this.httpClient
      .post(this._subClassesHostUrl(), subClass, this.getAuthHeaders());
    return RET_VAL;
  }

}
