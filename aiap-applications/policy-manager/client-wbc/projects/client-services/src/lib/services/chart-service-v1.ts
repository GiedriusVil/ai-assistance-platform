/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { Chart } from 'chart.js';

import { CarbonPalettes } from './chart-service-colors-v1';

const generateColors = count => {
  const colors = [
    '#89eda0',
    '#5b8121',
    '#8a3ffc',
    '#71cddd',
    '#5392ff',
    '#ff7eb6',
    '#34bc6e',
    '#bae6ff',
    '#95d13c',
    '#ffb000',
    '#fe8500',
    '#ff509e',
    '#9b82f3',
    '#89eda0',
    '#8a3ffc',
    '#71cddd',
    '#5392ff',
    '#ff7eb6',
    '#34bc6e',
    '#bae6ff',
    '#95d13c',
    '#ffb000',
    '#fe8500',
    '#ff509e',
    '#9b82f3',
    '#89eda0',
    '#8a3ffc',
    '#71cddd',
    '#5392ff',
    '#ff7eb6',
    '#34bc6e',
    '#bae6ff',
    '#95d13c',
    '#ffb000',
    '#fe8500',
    '#ff509e',
    '#9b82f3'
  ].reverse();
  return colors.slice(0, count);
};

@Injectable()
export class ChartServiceV1 {
  lineChartOptions: any = {
    maintainAspectRatio: false,
    title: {
      display: false
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: true,
            color: '#dfe3e6',
            zeroLineColor: '#dfe3e6'
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: true,
            color: '#dfe3e6',
            zeroLineColor: '#dfe3e6'
          }
        }
      ]
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    tooltips: {
      displayColors: false,
      yPadding: 12,
      xPadding: 12,
      bodySpacing: 0,
      titleSpacing: 0,
      titleMarginBottom: 0,
      footerSpacing: 0,
      footerMarginTop: 0,
      callbacks: {
        title: () => { }
      }
    },
    elements: {
      line: {
        tension: 0
      },
      point: {
        pointStyle: 'circle',
        backgroundColor: '#41d6c3'
      }
    }
  };

  barChartOptions: any = {
    maintainAspectRatio: false,
    title: {
      display: false
    },
    legend: {
      align: 'start',
      display: true,
      position: 'bottom'
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            color: '#dfe3e6',
            zeroLineColor: '#dfe3e6'
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          }
        }
      ]
    },
    tooltips: {
      displayColors: false,
      yPadding: 12,
      xPadding: 12,
      bodySpacing: 0,
      titleSpacing: 0,
      titleMarginBottom: 0,
      footerSpacing: 0,
      footerMarginTop: 0,
      callbacks: {
        title: () => { }
      }
    }
  };

  pieChartOptions: any = {
    maintainAspectRatio: false,
    title: {
      display: false
    },
    legend: {
      display: true,
      position: 'right'
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    tooltips: {
      displayColors: false,
      yPadding: 12,
      xPadding: 12,
      bodySpacing: 0,
      titleSpacing: 0,
      titleMarginBottom: 0,
      footerSpacing: 0,
      footerMarginTop: 0,
      callbacks: {
        title: () => { }
      }
    }
  };

  mixedChartOptions: any = {
    maintainAspectRatio: false,
    title: {
      display: false
    },
    legend: {
      display: true,
      position: 'right'
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: true,
            color: '#dfe3e6',
            zeroLineColor: '#dfe3e6'
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: true,
            color: '#dfe3e6',
            zeroLineColor: '#dfe3e6'
          }
        }
      ]
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    tooltips: {
      displayColors: false,
      yPadding: 12,
      xPadding: 12,
      bodySpacing: 0,
      titleSpacing: 0,
      titleMarginBottom: 0,
      footerSpacing: 0,
      footerMarginTop: 0,
      callbacks: {
        title: () => { }
      }
    },
    elements: {
      line: {
        tension: 0
      },
      point: {
        pointStyle: 'circle',
        backgroundColor: '#41d6c3'
      }
    }
  };

  stackedBarChartOptions: any = {
    maintainAspectRatio: false,
    title: {
      display: false
    },
    legend: {
      display: true,
      position: 'right'
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            color: '#dfe3e6',
            zeroLineColor: '#dfe3e6'
          }
        }
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            color: '#dfe3e6',
            zeroLineColor: '#dfe3e6'
          }
        }
      ]
    },
    tooltips: {
      displayColors: false,
      yPadding: 12,
      xPadding: 12,
      bodySpacing: 0,
      titleSpacing: 0,
      titleMarginBottom: 0,
      footerSpacing: 0,
      footerMarginTop: 0,
      callbacks: {
        title: () => { }
      }
    }
  };

  ngramChartOptions: any = {
    maintainAspectRatio: false,
    title: {
      display: false
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: true,
            color: '#dfe3e6',
            zeroLineColor: '#dfe3e6'
          },
          scaleLabel: {
            display: true,
            labelString: 'Taken'
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: true,
            color: '#dfe3e6',
            zeroLineColor: '#dfe3e6'
          },
          scaleLabel: {
            display: true,
            labelString: 'Confidence1'
          },
          ticks: {
            min: 0.0,
            stepSize: 0.2,
            max: 1.0
          }
        }
      ]
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    tooltips: {
      displayColors: false,
      yPadding: 12,
      xPadding: 12,
      bodySpacing: 0,
      titleSpacing: 0,
      titleMarginBottom: 0,
      footerSpacing: 0,
      footerMarginTop: 0,
      callbacks: {
        title: () => { }
      }
    },
    elements: {
      line: {
        tension: 0
      },
      point: {
        pointStyle: 'circle'
      }
    }
  };

  optimalThresholdChartOptions = {
    ...this.lineChartOptions,
    legend: {
      display: true
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Threshold'
          }
        }
      ]
    }
  };

  heuristicReputationEquationChartOptions = {
    ...this.lineChartOptions,
    legend: {
      display: true
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Threshold'
          }
        }
      ],
      yAxes: [
        {
          display: true,
          position: 'left',
          id: 'y-axis-1',
          scaleLabel: {
            display: true,
            labelString: 'Reputation'
          }
        },
        {
          display: true,
          position: 'right',
          id: 'y-axis-2',
          scaleLabel: {
            display: true,
            labelString: 'Effectiveness'
          }
        }
      ]
    }
  };

  constructor() {
    Chart.defaults.global.defaultFontColor = '#152935';
    Chart.defaults.global.defaultFontFamily = '"ibm-plex-sans", Helvetica Neue, Arial, sans-serif';
  }

  getLineChart(canvas, labels, data) {
    const DATASET: any = [
      {
        data: data,
        borderColor: '#41d6c3',
        fill: false
      }
    ];
    if (
      lodash.isArray(data) &&
      !lodash.isEmpty(data) &&
      lodash.isObject(data[0])
    ) {
      DATASET.pop();
      const COLORS = generateColors(data.length);
      data.forEach((d, index) => {
        DATASET.push({
          data: d.values,
          borderColor: COLORS[index],
          fill: false,
          label: d.label
        });
      });
    }
    return new Chart(canvas, {
      type: 'line',
      options: this.lineChartOptions,
      data: {
        labels: labels,
        datasets: DATASET
      }
    });
  }

  getTimeSeriesChart(
    canvas: HTMLCanvasElement,
    timeSeriesList: Array<Array<Chart.ChartPoint>>,
    legends?: Array<string>,
    extraOptions?: any,
    datasetExtraOptions?: Array<any>
  ): Chart {
    const colors = CarbonPalettes.categorical(timeSeriesList.length);
    let options = ramda.mergeDeepRight(
      ramda.omit(['tooltips'], this.lineChartOptions),
      {
        tooltips: {
          mode: 'label',
          displayColors: true
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                displayFormats: {
                  day: 'YYYY-MM-DD'
                },
                minUnit: 'day',
                ticks: {
                  minRotation: 20
                },
                tooltipFormat: 'YYYY-MM-DD'
              }
            }
          ]
        }
      });
    if (legends) {
      options.legend = {
        display: true,
        position: 'top' // https://www.carbondesignsystem.com/data-visualization/legends#position
        // Bottom is preferred, but top is also allowed and seems clearer with date labels
      };
    }
    if (extraOptions) {
      options = ramda.mergeDeepRight(options, extraOptions);
    }
    const configuration: Chart.ChartConfiguration = {
      type: 'line',
      options: options,
      data: {
        datasets: timeSeriesList.map((timeSeries, index) => {
          let dataset: any = {
            data: timeSeries,
            borderColor: colors[index],
            pointBackgroundColor: colors[index],
            backgroundColor: colors[index],
            fill: false
          };
          if (legends) {
            dataset.label = legends[index];
          }
          if (datasetExtraOptions) {
            dataset = ramda.mergeDeepRight(dataset, datasetExtraOptions[index]);
          }
          return dataset;
        })
      }
    };
    console.dir(configuration);
    return new Chart(canvas, configuration);
  }

  getTimeSeriesChartWithRightAxis(
    canvas: HTMLCanvasElement,
    timeSeriesList: Array<Array<Chart.ChartPoint>>,
    legends: [string, string],
    axisNames: [string, string]
  ): Chart {
    const extraOptions = {
      scales: {
        yAxes: [
          {
            id: 'yAxisLeft',
            display: true,
            position: 'left',
            type: 'linear',
            scaleLabel: {
              display: true,
              labelString: axisNames[0]
            }
          },
          {
            id: 'yAxisRight',
            display: true,
            position: 'right',
            type: 'linear',
            scaleLabel: {
              display: true,
              labelString: axisNames[1]
            }
          }
        ]
      }
    };
    const datasetExtraOptions = [
      {
        yAxisID: 'yAxisLeft'
      },
      {
        yAxisID: 'yAxisRight'
      }
    ];
    return this.getTimeSeriesChart(canvas, timeSeriesList, legends, extraOptions, datasetExtraOptions);
  }

  getPieChart(canvas, labels, data) {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            borderColor: '#ffffff',
            backgroundColor: generateColors(labels.length)
          }
        ]
      },
      options: this.pieChartOptions
    });
  }

  getBarChart(canvas, labels, data) {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        datasets: this.makeDataSets(data, labels)
      },
      options: this.barChartOptions
    });
  }

  getHorizontalBarChart(canvas, labels, data) {
    return new Chart(canvas, {
      type: 'horizontalBar',
      data: {
        datasets: this.makeDataSets(data, labels)
      },
      options: this.barChartOptions
    });
  }

  getStackedBarChart(canvas, barChartData) {
    return new Chart(canvas, {
      type: 'bar',
      data: barChartData,
      options: this.stackedBarChartOptions
    });
  }

  private makeDataSets(data, labels) {
    const ret = [];
    const colors = generateColors(data.length);
    for (let i = 0; i < data.length; i++) {
      ret.push({
        label: labels[i],
        backgroundColor: colors[i],
        data: [data[i]]
      });
    }
    return ret;
  }

  private makeDataSetsForMixedChart(data, lineLabel, stackLabels) {
    const ret: any = [
      {
        type: 'line',
        label: lineLabel,
        borderColor: '#41d6c3',
        backgroundColor: '#41d6c3',
        fill: false,
        data: data[0]
      }
    ];
    const colors = generateColors(stackLabels.length).reverse();
    for (let i = 1; i < data.length; i++) {
      ret.push({
        type: 'bar',
        label: stackLabels[i - 1],
        backgroundColor: colors[stackLabels.length - i],
        borderColor: colors[stackLabels.length - i],
        stack: 'Stack 0',
        data: data[i]
      });
    }
    return ret;
  }

  getMixedChart(canvas, labels, data) {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels.xAxis,
        datasets: this.makeDataSetsForMixedChart(data, labels.lineLabel, labels.stackLabels)
      },
      options: this.mixedChartOptions
    });
  }

  getNgramChart(canvas, labels, data, threshold = -1, positive) {
    return new Chart(canvas, {
      type: 'line',
      options: this.ngramChartOptions,
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            borderColor: positive ? '#41d6c3' : '#cc0000',
            fill: false,
            pointBackgroundColor: positive ? '#41d6c3' : '#cc0000'
          },
          ...(threshold > -1
            ? [
              {
                fill: false,
                borderColor: '#41d6c3',
                backgroundColor: '#41d6c3',
                borderDash: [5, 5],
                data: data.map(() => threshold),
                pointRadius: 0
              }
            ]
            : [])
        ]
      }
    });
  }

  getThresholdAnalysisChart(canvas, labels, data) {
    let dashed = 0;
    return new Chart(canvas, {
      type: 'line',
      options: this.optimalThresholdChartOptions,
      data: {
        labels: data[0].x,
        datasets: data.map((record, index) => {
          dashed = dashed === 4 ? 1 : dashed + 1;
          return {
            label: labels[index],
            data: record.y,
            fill: false,
            pointRadius: 0,
            borderColor: generateColors(index + 1)[index],
            borderDash: dashed > 2 ? [5, 5] : []
          };
        })
      }
    });
  }

  getHeuristicReputationEquationChart(canvas, labels, data, threshold) {
    const thresholdLineBoundaries = [Math.ceil(Math.max(...data[0].y)), Math.floor(Math.min(...data[0].y))];
    return new Chart(canvas, {
      type: 'line',
      options: this.heuristicReputationEquationChartOptions,
      data: {
        labels: data[0].x,
        datasets: [
          ...data.map((record, index) => {
            return {
              label: labels[index],
              data: record.y,
              fill: false,
              pointRadius: 0,
              borderColor: generateColors(index + 1)[index],
              yAxisID: `y-axis-${index + 1}`
            };
          }),
          {
            label: 'max_reputation',
            fill: false,
            borderColor: '#41d6c3',
            backgroundColor: '#41d6c3',
            borderDash: [5, 5],
            data: data[0].y.map((_, index) => {
              return { x: threshold, y: thresholdLineBoundaries[index] };
            }),
            pointRadius: 0
          }
        ]
      }
    });
  }

  getKneeCalculationChart(canvas, labels, data, maximums) {
    return new Chart(canvas, {
      type: 'line',
      options: this.optimalThresholdChartOptions,
      data: {
        labels: data[0].x,
        datasets: [
          ...data.map((record, index) => {
            return {
              label: labels[index],
              data: record.y,
              fill: false,
              pointRadius: 0,
              borderColor: generateColors(index + 1)[index]
            };
          }),
          {
            label: 'max_accuracy',
            fill: false,
            borderColor: '#9b82f3',
            backgroundColor: '#9b82f3',
            borderDash: [5, 5],
            data: maximums[0],
            pointRadius: 0
          },
          {
            label: 'max_incorrect_rate',
            fill: false,
            borderColor: '#ff509e',
            backgroundColor: '#ff509e',
            borderDash: [5, 5],
            data: maximums[1],
            pointRadius: 0
          }
        ]
      }
    });
  }

  getTonesChart(canvas, labels, data) {
    return new Chart(canvas, {
      type: 'line',
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        tooltips: {
          displayColors: false,
          yPadding: 12,
          xPadding: 12,
          bodySpacing: 0,
          titleSpacing: 0,
          titleMarginBottom: 0,
          footerSpacing: 0,
          footerMarginTop: 0
        },
        elements: {
          line: {
            tension: 0
          }
        }
      },
      data: {
        labels: labels,
        datasets: data
      }
    });
  }
}
