/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface Component {
  host: String,
  path: String,
  tag: String,
}

export interface Action {
  component: String,
  name: String,
  checked?: Boolean,
}

export interface View {
  type: String,
  component: String,
  name: String,
  icon: String,
  path: String,
  actions: Action[],
}

export interface Configuration {
  component: Component,
  route: String,
  type: String,
  views: View[],
};

export interface ApplicationUser {
  id: String,
  name: String,
};

export interface Updated {
  date: Date,
  user: ApplicationUser,
};

export interface Application {
  changed: Date,
  changedBy: String,
  configuration: Configuration[],
  created: Date,
  createdBy: String,
  id: String,
  name: String,
  updated: Updated,
};
