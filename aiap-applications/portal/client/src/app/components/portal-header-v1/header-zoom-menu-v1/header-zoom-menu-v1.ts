/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Output, OnDestroy, OnInit, Input } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import { LocalStorageServiceV1 } from 'client-shared-services';
import { ZoomServiceV1 } from 'src/app/services';


@Component({
  selector: 'aiap-header-zoom-menu-v1',
  templateUrl: './header-zoom-menu-v1.html',
  styleUrls: ['./header-zoom-menu-v1.scss'],
})
export class HeaderZoomMenuV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'HeaderZoomMenu';
  }

  @Input() user;

  selectedZoom: {
    value: number,
    label: string
  };

  constructor(
    private zoomService: ZoomServiceV1,
    private localStorageService: LocalStorageServiceV1
  ) { }

  ngOnInit(): void {
    const CURRENT_ZOOM = this.localStorageService.getZoom() ? +this.localStorageService.getZoom() : 1;

    this.selectedZoom = {
      value: CURRENT_ZOOM,
      label: CURRENT_ZOOM * 100 + '%'
    };
    _debugX(HeaderZoomMenuV1.getClassName(), 'ngOnInit', {
      CURRENT_ZOOM,
    });
    this.zoomService.adjustZoom(this.selectedZoom?.label)
  }

  ngOnDestroy(): void {
    //
  }

  handleZoomInEvent() {
    if(this.selectedZoom.value < 2){
      this.selectedZoom = {
        value: this.selectedZoom.value + 0.25,
        label: (this.selectedZoom.value + 0.25) * 100 + '%'
      }
      this.zoomService.adjustZoom(this.selectedZoom?.label)
      this.localStorageService.setZoom(String(this.selectedZoom.value))
    }

    _debugX(HeaderZoomMenuV1.getClassName(), 'handleZoomInEvent',
      {
        newZoom: this.selectedZoom,
      });
  }

  handleZoomOutEvent() {
    if(this.selectedZoom.value > 0.5){
      this.selectedZoom = {
        value: this.selectedZoom.value - 0.25,
        label: (this.selectedZoom.value - 0.25) * 100 + '%'
      }
      this.zoomService.adjustZoom(this.selectedZoom?.label)
      this.localStorageService.setZoom(String(this.selectedZoom.value))
    }
    
    _debugX(HeaderZoomMenuV1.getClassName(), 'handleZoomOutEvent',
      {
        newZoom: this.selectedZoom,
      });
  }

  handleZoomClearEvent() {
    this.selectedZoom = {
      value: 1,
      label: '100%'
    }
    this.zoomService.adjustZoom(this.selectedZoom?.label)
    this.localStorageService.setZoom(String(this.selectedZoom.value))
    
    _debugX(HeaderZoomMenuV1.getClassName(), 'handleZoomOutEvent',
      {
        newZoom: this.selectedZoom,
      });
  }
}
