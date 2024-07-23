/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input
} from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  TenantApplicationSaveModalV1,
} from './tenant-application-save-modal-v1/tenant-application-save-modal-v1';

@Component({
  selector: 'aiap-tenant-tab-applications-v1',
  templateUrl: './tenant-tab-applications-v1.html',
  styleUrls: ['./tenant-tab-applications-v1.scss'],
})
export class TenantTabApplicationsV1 {

  static getClassName() {
    return 'TenantTabApplicationsV1';
  }

  @ViewChild('applicationSaveModal') applicationSaveModal: TenantApplicationSaveModalV1;

  @Input() applications: any;
  @Output() applicationsChange = new EventEmitter<any[]>();

  handleApplicationAddEvent(applications: any) {
    _debugX(TenantTabApplicationsV1.getClassName(), 'handleApplicationAddEvent',
      {
        event,
        applications,
      });

    const NEW_APPLICATIONS = lodash.cloneDeep(this.applications);
    applications.forEach((application: any) => {
      this.checkForExistingApplication(NEW_APPLICATIONS, application);
    });
    this.applicationsChange.emit(NEW_APPLICATIONS);
  }

  checkForExistingApplication(existingApplications, application) {
    if (
      lodash.isArray(existingApplications) &&
      !lodash.isEmpty(application)
    ) {
      const IS_APPLICATION_EXISTS = existingApplications.some((existingApplication) => existingApplication?.id === application?.id);
      if (IS_APPLICATION_EXISTS) {
        const EXISTING_APPLICATION_INDEX = existingApplications.findIndex((existingApplication) => existingApplication?.id === application?.id);
        existingApplications[EXISTING_APPLICATION_INDEX] = application;
      } else {
        existingApplications.push(application);
      }
    }
  }

  handleApplicationSavePlaceShowEvent(event: any) {
    _debugX(TenantTabApplicationsV1.getClassName(), 'handleApplicationSavePlaceShowEvent',
      {
        event,
      });

    const APPLICATION = event?.value;
    this.applicationSaveModal.show(APPLICATION);
  }

  handleApplicationDeleteEvent(event: any) {
    _debugX(TenantTabApplicationsV1.getClassName(), 'handleApplicationDeleteEvent',
      {
        this_applications: this.applications,
        event: event,
      });
    const APPLICATION_ID = event?.id;
    if (
      lodash.isString(APPLICATION_ID) &&
      !lodash.isEmpty(APPLICATION_ID) &&
      lodash.isArray(this.applications) &&
      !lodash.isEmpty(this.applications)
    ) {
      const APPLICATIONS = [];
      for (const APPLICATION of this.applications) {
        if (
          APPLICATION_ID !== APPLICATION?.id
        ) {
          APPLICATIONS.push(APPLICATION);
        }
      }
      this.applicationsChange.emit(APPLICATIONS);
    }
  }
}
