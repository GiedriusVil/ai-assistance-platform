/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-file-uploader-v2',
  templateUrl: './file-uploader-v2.html',
  styleUrls: ['./file-uploader-v2.scss']
})
export class FileUploaderV2 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'FileUploaderV2';
  }

  @Input() title: string;
  @Input() description: string;
  @Input() accept: string[];
  @Input() multiple: boolean;
  @Input() drop: boolean;
  @Input() dropText: string;
  @Input() disabled: boolean;
  @Input() files: any;

  @Output() filesChange = new EventEmitter();

  constructor(
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  handleEventfilesChange(event: any) {
    _debugX(FileUploaderV2.getClassName(), 'onFilesAdded', { event });
    this.filesChange.emit(event);
  }
}
