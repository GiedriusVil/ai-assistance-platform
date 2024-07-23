/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';


@Component({
  selector: 'aiap-tenant-datasource-card-v1',
  templateUrl: './tenant-datasource-card-v1.html',
  styleUrls: ['./tenant-datasource-card-v1.scss'],
})
export class TenantDatasourceCardV1 implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'TenantDatasourceCardV1';
  }

  @Input() item: any;
  @Output() onCardSelected = new EventEmitter<any>();
  @Output() onShowSavePlace = new EventEmitter<any>();


  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  ngOnDestroy(): void {
    //
  }

  onChange(selected) {
    const DATASOURCE_ID = this.item?.id;
    const IS_CHECKED = selected?.checked;
    this.onCardSelected.emit({
      id: DATASOURCE_ID,
      checked: IS_CHECKED
    })
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  onCardClicked() {
    this.onShowSavePlace.emit(this.item);
  }

}
