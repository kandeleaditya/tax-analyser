'use server';

import { insertClientListData, insertYearlyData } from '@/lib/db';

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

export async function uploadExcelData(excelJsonData: DataItem[]) {
  await insertClientListData(excelJsonData);

  const yearsArr = Object.keys(excelJsonData?.[0]).filter(isNumeric);

  const yearlyData: DataItem[] = [];

  excelJsonData.forEach((jsonItem) => {
    yearsArr.forEach((year) => {
      yearlyData.push({ ...jsonItem, year, status: jsonItem[year] });
    });
  });

  await insertYearlyData(yearlyData);
}
