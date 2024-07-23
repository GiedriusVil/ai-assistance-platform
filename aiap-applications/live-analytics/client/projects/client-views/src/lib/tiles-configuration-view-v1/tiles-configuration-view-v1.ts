/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import { BaseView } from 'client-shared-views';

import { TileSaveModalV1 } from './tile-save-modal-v1/tile-save-modal-v1';
import { TileDeleteModalV1 } from './tile-delete-modal-v1/tile-delete-modal-v1';
import { TilesImportModalV1 } from './tile-import-modal-v1/tile-import-modal-v1';
@Component({
  selector: 'aiap-tiles-configuration-view-v1',
  templateUrl: './tiles-configuration-view-v1.html',
  styleUrls: ['./tiles-configuration-view-v1.scss'],
})
export class TilesConfigurationViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'TilesConfigurationViewV1';
  }

  @ViewChild('aiapTileSaveModalV1') tileSaveModal: TileSaveModalV1;
  @ViewChild('aiapTileDeleteModalV1') tileDeleteModal: TileDeleteModalV1;
  @ViewChild('aiapTilesImportModalV1') tilesImportModal: TilesImportModalV1;

  outlet = OUTLETS.liveAnalytics;

  state: any = {
    queryType: DEFAULT_TABLE.CHARTS_CONFIGURATION.TYPE,
    defaultSort: DEFAULT_TABLE.CHARTS_CONFIGURATION.SORT
  };

  constructor(
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleSearchClearEvent(event: any) {
    _debugX(TilesConfigurationViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(TilesConfigurationViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowSaveModal(event: any = undefined): void {
    _debugX(TilesConfigurationViewV1.getClassName(), `handleShowSaveModal`, { event });
    const TILE_ID = event?.value?.id
    this.tileSaveModal.show(TILE_ID);
  }

  handleChartDeleteModal(chartsIds: any = undefined): void {
    _debugX(TilesConfigurationViewV1.getClassName(), `handleShowDeleteModal`, { event });
    this.tileDeleteModal.show(chartsIds);
  }


  handleShowImportModal(event: any) {
    _debugX(TilesConfigurationViewV1.getClassName(), `handleShowImportModal`, { event });
    this.tilesImportModal.showImportModal();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'tiles-configuration',
      children: [
        ...children,
        {
          path: '',
          component: TilesConfigurationViewV1,
          data: {
            name: 'Tiles configuration view',
            component: TilesConfigurationViewV1.getClassName(),
            actions: [
              {
                name: 'Add tiles',
                component: 'tiles.view.add'
              },
              {
                name: 'Edit tiles',
                component: 'tiles.view.edit'
              },
              {
                name: 'Delete tiles',
                component: 'tiles.view.delete'
              },
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'tiles_configuration_view_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }

}
