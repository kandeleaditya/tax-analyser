"use client";

import { FormEvent, useRef, useState } from "react";
import * as XLSX from "xlsx";

function getDateFromExcel(excelDate: number) {
  // Excel date epoch is December 30, 1899
  const excelEpoch = new Date(1899, 11, 30);
  const milliseconds = excelDate * 24 * 60 * 60 * 1000;
  const date = new Date(excelEpoch.getTime() + milliseconds);
  const formattedDate = date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formattedDate;
}

const filterExcelKeys = (list: string[]): string[] => {
  return list.filter((str) => {
    if (
      str.includes("Substituted Accounting Period") ||
      str.includes("Lodgment Code") ||
      str.includes("Flexible Lodgment Eligibility")
    ) {
      return false;
    }

    return true;
  });
};

const toCamelCase = (input: string): string => {
  if (input.includes(" Status")) {
    input = input.replace(" Status", "");
  }

  return input
    .replace(/\s+(\w)/g, function (match, letter) {
      return letter.toUpperCase();
    })
    .replace(/\s+/g, "");
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const barsIconRef = useRef<HTMLButtonElement>(null);

  const createJsonData = (excelData: string[][]) => {
    const keysObj: { [key: string]: string } = filterExcelKeys(
      excelData[0]
    ).reduce(
      (acc, item) => ({
        ...acc,
        [item]: toCamelCase(item),
      }),
      {}
    );

    const jsonData: { [key: string]: string | Date }[] = [];

    excelData.slice(1).forEach((rowData) => {
      const data: { [key: string]: string | Date } = {};

      rowData.forEach((dataItem, index) => {
        const keyName = keysObj[excelData[0][index]];

        if (keyName) {
          if (keyName === "DueDate") {
            data[keyName] = getDateFromExcel(+dataItem);
          } else {
            data[keyName] = dataItem;
          }
        }
      });

      jsonData.push(data);
    });

    console.log("jsonData", jsonData);
  };

  const formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // assuming there's only one sheet
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
      console.log("excelData", excelData);
      createJsonData(excelData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <main className="flex min-h-screen">
      <button
        id="sidebarToggle"
        className="md:hidden focus:outline-none absolute top-5 left-1"
        ref={barsIconRef}
        onClick={function (e) {
          sidebarRef.current?.classList.toggle("hidden");
          (e.target as HTMLButtonElement)
            ?.closest("button")
            ?.classList.toggle("hidden");
        }}
      >
        <i className="fas fa-bars fa-lg"></i>
      </button>
      {/* <!-- Side Panel --> */}
      <div
        className="flex flex-col h-screen bg-gray-800 text-white hidden md:block"
        ref={sidebarRef}
      >
        <div className="py-4 px-6 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Tax Analyser</h1>
          <button
            id="sidebarToggle"
            className="block md:hidden focus:outline-none absolute top-5 left-1"
            onClick={function (e) {
              sidebarRef.current?.classList.toggle("hidden");
              console.log("e", e.target);
              barsIconRef.current?.classList.toggle("hidden");
            }}
          >
            <i className="fas fa-close fa-lg"></i>
          </button>
        </div>
        <nav id="sidebar" className="lg:block lg:h-auto lg:pb-0">
          <ul className="my-8">
            <li className="py-2 px-6 hover:bg-gray-700">
              <a href="#" className="block">
                Home
              </a>
            </li>
            <li className="py-2 px-6 hover:bg-gray-700">
              <a href="#" className="block">
                Upload Excel
              </a>
            </li>
          </ul>
        </nav>
        <div className="py-4 px-6 border-t border-gray-700">
          <a href="#" className="block">
            Logout
          </a>
        </div>
      </div>

      {/* <!-- Content Section --> */}
      <div className="flex flex-col flex-1 justify-center items-center h-screen">
        <div className="w-full max-w-sm">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={formSubmitHandler}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="file"
              >
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
  );
}
