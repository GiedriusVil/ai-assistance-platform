/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const parseFromCSVFile = (
  csvPath,
  csvName,
  csvDelimiter,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    let jsonArray = [];
    const readingStream = fs.createReadStream(path.resolve(csvPath, csvName))
    readingStream.on('error', (error) => {
      reject({ message: error.message });
    })
      .pipe(parse({
        delimiter: csvDelimiter,
        from_line: 2,
      }))
      .on('data', (line) => {
        jsonArray.push(line);
        resolve(jsonArray)
        readingStream.close();
      }).on('end', () => {
        resolve(jsonArray)
        readingStream.close();
      }).on('error', (error) => {
        reject({ message: error.message });
      });
  });
};

const getMonthFromString = (
  month: any,
) => {
  const RET_VAL = new Date(Date.parse(month + ' 1, 2012')).getMonth() + 1;
  return RET_VAL;
}

function getValidMonths(
  startDate: any,
  endDate: any,
) {
  const monthNames =
    [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  const RET_VAL = [];
  const nextDate = new Date(startDate);
  let currentDate = startDate;
  RET_VAL.push({
    year: new Date(startDate).getFullYear(),
    month: monthNames[Number(new Date(startDate).getMonth())],
  });
  while (currentDate < endDate) {
    currentDate = nextDate.toISOString();
    nextDate.setDate(nextDate.getDate() + 1);
    if (
      new Date(startDate).getMonth() != new Date(currentDate).getMonth()
    ) {
      RET_VAL.push({ year: new Date(currentDate).getFullYear(), month: monthNames[Number(new Date(currentDate).getMonth())] });
      startDate = currentDate;
    }
  }
  return RET_VAL;
}

/**
 * @deprecated -> Seems legacy code...
 */
const getDataFromCSV = async (
  initDate,
  endDate,
  csvPath,
  csvName,
  csvDelimiter,
  csvIndex
) => {
  const MONTHS = getValidMonths(initDate, endDate);

  const RET_VAL = [];

  const DATA = await parseFromCSVFile(csvPath, csvName, csvDelimiter);

  if (
    DATA.length != 0
  ) {
    DATA.forEach((record: any) => {

      MONTHS.forEach(month => {
        if (
          Number(record[0]) == Number(month.year) &&
          record[1] == month.month
        ) {
          if (record[2].length == 0) {
            record[2] = 0;
          }
          RET_VAL.push({
            year: month.year,
            month: getMonthFromString(month.month),
            count: parseInt(record[csvIndex])
          });
        }
      });

    });
  }

  return RET_VAL;
}


export {
  getDataFromCSV,
}
