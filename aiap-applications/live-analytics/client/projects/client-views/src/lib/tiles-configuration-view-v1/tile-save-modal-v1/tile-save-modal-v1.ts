/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  TILES_CONFIGURATION_MESSAGES
} from 'client-utils';

import { DEFAULT_CONFIGURATION } from './tile-save-modal-v1.utils';

import {
  _debugX,
  _error,
  _debug
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import { TilesConfigurationsService } from 'client-services';
@Component({
  selector: 'aiap-tile-save-modal-v1',
  templateUrl: './tile-save-modal-v1.html',
  styleUrls: ['./tile-save-modal-v1.scss']
})
export class TileSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TileSaveModalV1';
  }
  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  configuration: any = {};

  _tile: any = {
    id: '',
    ref: undefined,
    type: undefined,
    name: undefined,
    value: undefined

  }
  tile: any = lodash.cloneDeep(this._tile);

  constructor(
    private tilesConfigurationsService: TilesConfigurationsService,
    private notificationService: NotificationServiceV2,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.mode = 'code';
    this.jsonEditorOptions.modes = ['code'];
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  save() {
    _debugX(TileSaveModalV1.getClassName(), 'save', {
      this_segment: this.configuration,
      jsonEditorValue: this.jsonEditor.get()
    });
    const TILE = this.sanitizeTile();
    this.tilesConfigurationsService.saveOne(TILE)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveLambdaConfigurationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TileSaveModalV1.getClassName(), 'save', { response });
        this.notificationService.showNotification(TILES_CONFIGURATION_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.filterEmit(undefined)
        this.close();
      });
  }

  sanitizeTile() {
    const RET_VAL: any = lodash.cloneDeep(this.tile);
    RET_VAL.value = this.jsonEditor.get();
    return RET_VAL;
  }

  handleSaveLambdaConfigurationError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(TILES_CONFIGURATION_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  loadFormData(id: any) {
    this.eventsService.loadingEmit(true);
    this.tilesConfigurationsService.retrieveTileFormData(id)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveLambdaConfigurationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(TileSaveModalV1.getClassName(), 'loadViewData', { response });
        const TILE = response?.tile;
        if (
          lodash.isEmpty(TILE)
        ) {
          this.tile = lodash.cloneDeep(this._tile);
          this.tile.value = DEFAULT_CONFIGURATION.tile;
        } else {
          this.tile = TILE
        }
        this.superShow();
        this.eventsService.loadingEmit(false);
      });
  }

  show(tileId: string) {
    _debugX(TileSaveModalV1.getClassName(), 'show', { tileId });
    this.loadFormData(tileId);
  }

}
