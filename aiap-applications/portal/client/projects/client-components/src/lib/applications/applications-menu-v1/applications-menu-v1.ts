/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aiap-applications-menu-v1',
  templateUrl: './applications-menu-v1.html',
  styleUrls: ['./applications-menu-v1.scss'],
})
export class ApplicationsMenuV1 implements OnInit {

  static getClassName() {
    return 'ApplicationsMenuV1';
  }

  @Output() onApplicationChange = new EventEmitter<any>();

  applications: any = [];

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
  ) { }

  get allowed(): boolean {
    return lodash.isEmpty(this.applications);
  }

  get applicationName(): string {
    if (
      lodash.isEmpty(this.applications)
    ) {
      return 'No application authorized';
    }
    const APPLICATION = this.getSelectedApplication();
    if (
      lodash.isEmpty(APPLICATION) ||
      lodash.isEmpty(APPLICATION.name)
    ) {
      return 'Select application';
    }

    return APPLICATION.name;
  }

  private getAvailableApplications() {
    const SESSION = this.sessionService.getSession();
    if (
      !lodash.isEmpty(SESSION)
    ) {
      const APPLICATIONS = SESSION?.tenant?.applications;
      if (
        !lodash.isEmpty(APPLICATIONS)
      ) {
        _debugX(ApplicationsMenuV1.getClassName(), `availableApplications`,
          {
            APPLICATIONS
          });
        return APPLICATIONS;
      }
    }
    return [];
  }

  private getSelectedApplication() {
    const SESSION = this.sessionService.getSession();
    if (!lodash.isEmpty(SESSION)) {
      const APPLICATION = ramda.path(['application'], SESSION);
      if (!lodash.isEmpty(APPLICATION)) {
        return APPLICATION;
      }
    }

    return null;
  }

  ngOnInit() {
    this.applications = this.getAvailableApplications();
  }

  emitApplicationChange(event) {
    _debugX(ApplicationsMenuV1.getClassName(), `emitApplicationChange`,
      {
        event,
      });

    this.onApplicationChange.emit(event);
  }
}
