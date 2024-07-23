/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileItem } from 'carbon-components-angular';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of, Subject, Observable } from 'rxjs';

import * as lodash from 'lodash';

import {
  CLASSIFICATION_CATEGORIES_MESSAGES
} from '../../messages';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  ClassificationCatalogsServiceV1
} from 'client-services';

@Component({
  selector: 'aiap-classification-category-import-modal-v1',
  templateUrl: './classification-category-import-modal-v1.html',
  styleUrls: ['./classification-category-import-modal-v1.scss'],
})
export class ClassificationCategoryImportModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassificationCategoryImportModal';
  }

  private _destroyed$: Subject<void> = new Subject();

  @ViewChild('classificationCategoryImportForm') classificationCategoryImportForm: NgForm;

  isOpen = false;

  _state = {
    catalogId: undefined,
    files: new Set<FileItem>(),
    queryType: DEFAULT_TABLE.UNSPSC_SEGMENTS.TYPE,
    defaultSort: DEFAULT_TABLE.UNSPSC_SEGMENTS.SORT,
  }
  state: any = lodash.cloneDeep(this._state);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private queryService: QueryServiceV1,
    private classificationCatalogsService: ClassificationCatalogsServiceV1
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  close(): void {
    this.isOpen = false;
  }

  show(catalogId: any): void {
    const NEW_STATE = lodash.cloneDeep(this._state);
    NEW_STATE.catalogId = catalogId;
    this.state = NEW_STATE;
    _debugX(ClassificationCategoryImportModalV1.getClassName(), 'show', { this_state: this.state, catalogId: catalogId });
    this.isOpen = true;
  }

  isDataInvalid() {
    const RET_VAL = !this.state?.files?.size || this.classificationCategoryImportForm.invalid;
    return RET_VAL;
  }

  handleFilesChange(files: Set<FileItem>): void {
    _debugX(ClassificationCategoryImportModalV1.getClassName(), 'handleFilesChange', { this_state: this.state, files: files });
  }

  handleClassificationCategoryImportClickEvent(event: any) {
    let file: File;
    this.state.files.forEach((item: FileItem) => {
      if (
        !item.uploaded
      ) {
        item.state = 'upload';
      }
      file = item.file;
    });
    if (
      file
    ) {
      this.eventsService.loadingEmit(true);
      this.classificationCatalogsService.importOneByFile(this.state?.catalogId, file).pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleImportOneByFileError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        const NOTIFICATION = CLASSIFICATION_CATEGORIES_MESSAGES.SUCCESS.IMPORT_ONE_BY_FILE;
        this.notificationService.showNotification(NOTIFICATION);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.close();
      });
    }
  }

  private handleImportOneByFileError(error: any): Observable<void> {
    _debugX(ClassificationCategoryImportModalV1.getClassName(), 'handleImportOneByFileError');
    this.eventsService.loadingEmit(false);
    this.state.files.forEach((item: FileItem) => {
      if (
        !item.uploaded
      ) {
        item.state = 'edit';
        item.invalid = true;
        item.invalidText = 'Unable to upload this file!'
      }
    });
    const NOTIFICATION = CLASSIFICATION_CATEGORIES_MESSAGES.ERROR.IMPORT_ONE_BY_FILE;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
