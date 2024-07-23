/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as lodash from 'lodash';

import { v4 as uuidv4 } from 'uuid';

declare let Box: any;

import { _debugX, _errorX } from 'client-utils';

import {
  BoxConnectorServiceV1,
  HTMLDependenciesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-multimedia-box',
  templateUrl: './multimedia-box.comp.html',
  styleUrls: ['./multimedia-box.comp.scss']
})
export class MultimediaBoxComp implements OnInit {

  static getClassName() {
    return 'MultimediaBoxComp';
  }

  @Input() multimedia: any;
  @Input() options: any;

  interval: any;
  preview: any;

  _state = {
    identifier: uuidv4(),
    isLoading: false,
    internal: null,
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    private boxConnectorService: BoxConnectorServiceV1,
  ) { }

  ngOnInit() {
    this.htmlDependenciesService.loadJSDependency('box-connector-js-script', 'https://cdn01.boxcdn.net/platform/preview/2.84.0/en-US/preview.js');
    this.htmlDependenciesService.loadCSSDependency('box-connector-css-link', 'https://cdn01.boxcdn.net/platform/preview/2.84.0/en-US/preview.css');
    this.loadBoxPreview();
  }

  getBoxContainerClassName() {
    const RET_VAL = `box-container-${this.state.identifier}`;
    return RET_VAL;
  }

  getBoxContainerClassNames() {
    const RET_VAL = `d-flex justify-content-center align-items-center ${this.getBoxContainerClassName()}`;
    return RET_VAL;
  }

  private setLoading(value: boolean) {
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.isLoading = value;
    this.state = NEW_STATE;
  }

  private loadBoxPreview() {
    let connectorId;
    let fileIds;
    try {
      _debugX(MultimediaBoxComp.getClassName(), 'loadBoxPreview', { this_multimedia: this.multimedia });
      connectorId = this.multimedia?.connectorId;
      fileIds = this.multimedia?.fileIds;
      this.setLoading(true);
      if (
        lodash.isEmpty(connectorId) ||
        lodash.isEmpty(fileIds) ||
        !lodash.isArray(fileIds)
      ) {
        return;
      }
      this.boxConnectorService.retrieveAccessToken({ connectorId })
        .pipe(
          catchError((error: any) => this.handleRetreveAccessTokenError(error))
        ).subscribe((response: any) => {
          _debugX(MultimediaBoxComp.getClassName(), 'loadBoxPreview', { response });
          const BOX_CONTAINER_CLASS_NAME = this.getBoxContainerClassName();
          if (
            !lodash.isEmpty(response?.boxCredentials?.accessToken)
          ) {
            const DEFAULT_OPTIONS = {
              container: `.${BOX_CONTAINER_CLASS_NAME}`,
              showDownload: true,
              collection: fileIds,
              logoUrl: this.multimedia?.icon,
            };
            const OPTIONS = lodash.merge(DEFAULT_OPTIONS, this.options)
            setTimeout(() => {
              this.preview = new Box.Preview();
              this.preview.show(fileIds[0], response?.boxCredentials?.accessToken, OPTIONS);
              this.setLoading(false);
            }, 500);
          }
        });

    } catch (error) {
      this.setLoading(false);
      _errorX(MultimediaBoxComp.getClassName(), 'loadBoxPreview', { error });
      throw error;
    }
  }

  private handleRetreveAccessTokenError(error: any) {
    _errorX(MultimediaBoxComp.getClassName(), 'handleRetreveAccessTokenError'), { error };
    this.setLoading(false);
    return of();
  }

  print() {
    this.preview.print();
  }

  download() {
    this.preview.download();
  }
}
