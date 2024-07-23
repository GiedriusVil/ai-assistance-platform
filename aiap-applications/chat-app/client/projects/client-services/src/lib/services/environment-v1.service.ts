/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
export abstract class EnvironmentServiceV1 {
  public abstract getEnvironment(): {
    production: boolean;
    hostUrl: string;
  };
}
