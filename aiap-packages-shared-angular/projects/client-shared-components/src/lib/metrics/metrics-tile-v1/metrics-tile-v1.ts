/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'aiap-metrics-tile-v1',
  templateUrl: './metrics-tile-v1.html',
  styleUrls: ['./metrics-tile-v1.scss'],
})
export class MetricsTileV1 implements OnInit {

  static getClassName() {
    return 'MetricsTileV1';
  }

  @Output() onSelected = new EventEmitter<any>();

  @Input() type;
  @Input() isSelected: boolean;

  @Input() displayData;
  @Input() headerText: string;
  @Input() showTooltip: boolean = false;
  @Input() tooltipText: string;
  @Input() tooltipTextPlacement: string = 'bottom';
  @Input() tooltipAlignment: string = 'start';

  text: string;
  placement: string;
  alignment: string;

  constructor() { }


  retrieveTargetClassName() {
    let retVal = 'target';
    if (
      this.isSelected
    ) {
      retVal = 'target-selected';
    }
    return retVal;
  }

  ngOnInit() {
    this.text = this.tooltipText;
    this.placement = this.tooltipTextPlacement;
    this.alignment = this.tooltipAlignment;
  }

  hanleClickEvent() {
    this.onSelected.emit({ type: this.type });
  }
}
