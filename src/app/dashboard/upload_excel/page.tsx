'use client';

import { FormEvent, useState } from 'react';
import * as XLSX from 'xlsx';
import SidePanel from '@/components/side-panel';
import { uploadExcelData } from '@/actions';

function getDateFromExcel(excelDate: number) {
  // Excel date epoch is December 30, 1899
  const excelEpoch = new Date(1899, 11, 30);
  const milliseconds = excelDate * 24 * 60 * 60 * 1000;
  const date = new Date(excelEpoch.getTime() + milliseconds);
  const formattedDate = date.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return formattedDate;
}

const filterExcelKeys = (list: string[]): string[] => {
  return list.filter((str) => {
    if (
      str.includes('Substituted Accounting Period') ||
      str.includes('Lodgment Code') ||
      str.includes('Flexible Lodgment Eligibility')
    ) {
      return false;
    }

    return true;
  });
};

const toCamelCase = (input: string): string => {
  if (input.includes(' Status')) {
    input = input.replace(' Status', '');
  }

  return input
    .replace(/\s+(\w)/g, function (match, letter) {
      return letter.toUpperCase();
    })
    .replace(/\s+/g, '');
};

// const parseDate = (dateString: string) => {
//   const parts = dateString.split('/');

//   const day = parseInt(parts[0], 10);
//   const month = parseInt(parts[1], 10) - 1;
//   const year = parseInt(parts[2], 10);

//   const date = new Date(year, month, day);

//   return date;
// };

// const isCurrentDateGreaterThan = (dateString: string) => {
//   const passedDate = parseDate(dateString);

//   const currentDate = new Date();

//   console.log('dateString', dateString);
//   console.log('currentDate', currentDate);
//   console.log('passedDate', passedDate);

//   return currentDate > passedDate;
// };

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // const getClientTypeDistribution = (data: DataItem[]): ClientTypeDataItem[] | undefined => {
  //   if (!data) return;

  //   const clientTypeMap = data.reduce((acc: { [clientType: string]: number }, item: DataItem) => {
  //     acc[item.ClientType as string] = (acc?.[item.ClientType as string] || 0) + 1;
  //     return acc;
  //   }, {});

  //   return Object.entries(clientTypeMap).map(([clientType, count]) => ({
  //     clientType,
  //     count,
  //     isVisible: true,
  //   }));
  // };

  // const getLatestYear = (dataItem: DataItem) => {
  //   let latestYear = 0;

  //   Object.keys(dataItem).forEach((key) => {
  //     if (/^\d+$/.test(key) && +key > latestYear) {
  //       latestYear = +key;
  //     }
  //   });

  //   return latestYear;
  // };

  // const getLatestYearLodgementData = (data: DataItem[]): LatestYearLodgementDistributionItem[] | undefined => {
  //   if (!data) return;

  //   const latestYear = getLatestYear(data[0]);

  //   const lastYearLodgementMap = data.reduce(
  //     (
  //       acc: {
  //         [key in LodgementNames]: number;
  //       },
  //       item: DataItem
  //     ) => {
  //       if (item[latestYear] === 'Received') {
  //         acc.Lodged = (acc.Lodged || 0) + 1;
  //       } else if (item[latestYear] === 'Not Received' && !isCurrentDateGreaterThan(item.DueDate)) {
  //         acc['Not Lodged'] = (acc['Not Lodged'] || 0) + 1;
  //       } else if (item[latestYear] === 'Not Received' && isCurrentDateGreaterThan(item.DueDate)) {
  //         acc.Outstanding = (acc.Outstanding || 0) + 1;
  //       } else {
  //         acc.Others = (acc.Others || 0) + 1;
  //       }
  //       return acc;
  //     },
  //     { Lodged: 0, 'Not Lodged': 0, Outstanding: 0, Others: 0 }
  //   );

  //   return Object.entries(lastYearLodgementMap).map(([name, count]) => ({
  //     name: name as LodgementNames,
  //     count,
  //     isVisible: true,
  //   }));
  // };

  const createJsonData = (excelData: string[][]) => {
    const keysObj: { [key: string]: string } = filterExcelKeys(excelData[0]).reduce(
      (acc, item) => ({
        ...acc,
        [item]: toCamelCase(item),
      }),
      {}
    );

    const jsonData: DataItem[] = [];

    excelData.slice(1).forEach((rowData) => {
      const data: DataItem = {
        ClientType: '',
        ClientName: '',
        DueDate: '',
        LastYearLodged: 0,
        TFN: 0,
        db_prefix: '',
      };

      rowData.forEach((dataItem, index) => {
        const keyName = keysObj[excelData[0][index]];

        if (keyName) {
          if (keyName === 'DueDate') {
            data[keyName] = getDateFromExcel(+dataItem);
          } else {
            data[keyName] = dataItem;
          }
        }
      });

      jsonData.push(data);
    });

    uploadExcelData(jsonData);

    // const clientTypeData = getClientTypeDistribution(jsonData);
    // const latestYearLodgementData = getLatestYearLodgementData(jsonData);

    // console.log('jsonData', jsonData);
    // console.log('clientTypeData', clientTypeData);
    // console.log('latestYearLodgementData', latestYearLodgementData);

    // setData(jsonData);
    // setClientTypeData(clientTypeData);
    // setLatestYearLodgementData(latestYearLodgementData);
  };

  const formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0]; // assuming there's only one sheet
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
      createJsonData(excelData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <>
      <main className="flex min-h-screen">
        <SidePanel />
        {/* <!-- Content Section --> */}
        <div className="flex flex-col flex-1 justify-center items-center h-screen">
          <div className="w-full max-w-sm">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={formSubmitHandler}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                  Choose an Excel file
                </label>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  id="file"
                  name="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
