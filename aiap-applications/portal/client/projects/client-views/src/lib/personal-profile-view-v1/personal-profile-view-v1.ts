/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component } from '@angular/core';
import { BaseView } from 'client-shared-views';

@Component({
  selector: 'aiap-personal-profile-view-v1',
  templateUrl: './personal-profile-view-v1.html',
  styleUrls: ['./personal-profile-view-v1.scss']
})
export class PersonalProfileViewV1 extends BaseView {

  static getClassName() {
    return 'PersonalProfileViewV1';
  }

  constructor() {
    super();
  }

  static route() {
    const RET_VAL = {
      path: 'personal-profile',
      component: PersonalProfileViewV1,
      data: {
        name: 'personal_profile_view_v1.name',
        description: 'personal_profile_view_v1.description',
        component: PersonalProfileViewV1.getClassName(),
        actions: [
          {
            name: 'personal_profile_view_v1.actions.change_tenant.name',
            component: 'profile.view.change.tenants',
            description: 'personal_profile_view_v1.actions.change_tenant.description',
          },
        ]
      }
    };
    return RET_VAL;
  }
}
