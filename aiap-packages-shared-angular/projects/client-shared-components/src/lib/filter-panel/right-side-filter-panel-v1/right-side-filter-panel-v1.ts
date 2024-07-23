/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { _debugX } from 'client-shared-utils';

@Component({
  selector: 'aiap-right-side-filter-panel-v1',
  templateUrl: './right-side-filter-panel-v1.html',
  styleUrls: ['./right-side-filter-panel-v1.scss'],
})
export class RightSideFilterPanelV1 {
  static getClassName() {
    return 'RightSideFilterPanelV1';
  }

  @ViewChild('filterPanel') filterPanel: ElementRef<HTMLElement>;

  @Input() config: any;

  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onResetFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    //
  }

  closePanel() {
    this.config.isVisible = false;
    this.filterPanel.nativeElement.classList.remove(
      'aiap-right-side-filter--open'
    );
  }

  handleFilterResetEvent(): void {
    this.onResetFilter.emit();
  }

  handleFilterApplyEvent(): void {
    this.onFilterChange.emit();
    this.closePanel();
  }
}
