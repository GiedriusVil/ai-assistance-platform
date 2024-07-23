/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/


const DEFAULT_CHART: any = {
  chart: {
    type: "mixed",
    metrics: [
      {
        id: "metric-id",
        name: "metric-name",
        chartType: "bar",
        isDefault: true,
        queryRef: "your-query-ref",
        filters: []
      }
    ]
  }
}

export const DEFAULT_CONFIGURATION: any = {
  chart: DEFAULT_CHART
}
