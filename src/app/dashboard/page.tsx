"use client";

import LogoutButton from "@/components/logout-btn";
import { FormEvent, useRef, useState } from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
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

const parseDate = (dateString: string) => {
  const parts = dateString.split("/");

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  return date;
};

const isCurrentDateGreaterThan = (dateString: string) => {
  const passedDate = parseDate(dateString);

  const currentDate = new Date();

  console.log("dateString", dateString);
  console.log("currentDate", currentDate);
  console.log("passedDate", passedDate);

  return currentDate > passedDate;
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const barsIconRef = useRef<HTMLButtonElement>(null);
  const [data, setData] = useState<DataItem[]>();
  const [clientTypeData, setClientTypeData] = useState<ClientTypeDataItem[]>();
  const [latestYearLodgementData, setLatestYearLodgementData] =
    useState<LatestYearLodgementDistributionItem[]>();
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableDataItem[]>();
  const [latestYear, setLatestYear] = useState<number>(0);

  const getClientTypeDistribution = (
    data: DataItem[]
  ): ClientTypeDataItem[] | undefined => {
    if (!data) return;

    const clientTypeMap = data.reduce(
      (acc: { [clientType: string]: number }, item: DataItem) => {
        acc[item.ClientType as string] =
          (acc?.[item.ClientType as string] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(clientTypeMap).map(([clientType, count]) => ({
      clientType,
      count,
      isVisible: true,
    }));
  };

  const getLatestYear = (dataItem: DataItem) => {
    let latestYear = 0;

    Object.keys(dataItem).forEach((key) => {
      if (/^\d+$/.test(key) && +key > latestYear) {
        latestYear = +key;
      }
    });

    return latestYear;
  };

  const getLatestYearLodgementData = (
    data: DataItem[]
  ): LatestYearLodgementDistributionItem[] | undefined => {
    if (!data) return;

    const latestYear = getLatestYear(data[0]);
    setLatestYear(latestYear);

    const lastYearLodgementMap = data.reduce(
      (
        acc: {
          [key in LodgementNames]: number;
        },
        item: DataItem
      ) => {
        if (item[latestYear] === "Received") {
          acc.Lodged = (acc.Lodged || 0) + 1;
        } else if (
          item[latestYear] === "Not Received" &&
          !isCurrentDateGreaterThan(item.DueDate)
        ) {
          acc["Not Lodged"] = (acc["Not Lodged"] || 0) + 1;
        } else if (
          item[latestYear] === "Not Received" &&
          isCurrentDateGreaterThan(item.DueDate)
        ) {
          acc.Outstanding = (acc.Outstanding || 0) + 1;
        } else {
          acc.Others = (acc.Others || 0) + 1;
        }
        return acc;
      },
      { Lodged: 0, "Not Lodged": 0, Outstanding: 0, Others: 0 }
    );

    return Object.entries(lastYearLodgementMap).map(([name, count]) => ({
      name: name as LodgementNames,
      count,
      isVisible: true,
    }));
  };

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

    const jsonData: DataItem[] = [];

    excelData.slice(1).forEach((rowData) => {
      const data: DataItem = {
        ClientType: "",
        ClientName: "",
        DueDate: "",
        LastYearLodged: 0,
        TFN: 0,
      };

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

    const clientTypeData = getClientTypeDistribution(jsonData);
    const latestYearLodgementData = getLatestYearLodgementData(jsonData);

    console.log("latestYearLodgementData", latestYearLodgementData);

    setData(jsonData);
    setClientTypeData(clientTypeData);
    setLatestYearLodgementData(latestYearLodgementData);
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
      createJsonData(excelData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const COLORS = [
    "#6C8EBF",
    "#A1E8AF",
    "#FFB6C1",
    "#E6E6FA",
    "#FFD700",
    "#FF7F50",
    "#008080",
    "#C8A2C8",
    "#87CEEB",
    "#FFA07A",
    "#98FB98",
    "#DDA0DD",
    "#B0E0E6",
    "#FFE4C4",
    "#7FFFD4",
    "#F0E68C",
    "#D2B48C",
    "#00FF7F",
    "#AFEEEE",
    "#FF6347",
  ];

  const onPieEnter = (entry: { name: string }, index: number) => {
    setActiveElement(entry.name);
  };

  const onPieClick = (e: any) => {
    console.log("e", e);
    const selectedClientType = e.clientType;
    const selectedLodgementType = e.name;
    if (selectedClientType) {
      const clientTypeData: TableDataItem[] = data!
        .filter((dataItem) => dataItem.ClientType === selectedClientType)
        .map(({ TFN, ClientName, ClientType }) => ({
          TFN,
          ClientName,
          ClientType,
        }));

      setTableData(clientTypeData);
    } else if (selectedLodgementType) {
      const lodgmentTypeData: TableDataItem[] = data!
        .filter((dataItem) => {
          if (selectedLodgementType === "Lodged") {
            return dataItem[latestYear] === "Received";
          } else if (selectedLodgementType === "Not Lodged") {
            return (
              dataItem[latestYear] === "Not Received" &&
              !isCurrentDateGreaterThan(dataItem.DueDate)
            );
          } else if (selectedLodgementType === "Outstanding") {
            return (
              dataItem[latestYear] === "Not Received" &&
              isCurrentDateGreaterThan(dataItem.DueDate)
            );
          } else {
            return (
              dataItem[latestYear] !== "Received" &&
              dataItem[latestYear] !== "Not Received"
            );
          }
        })
        .map(({ TFN, ClientName, ClientType, DueDate, LastYearLodged }) => ({
          TFN,
          ClientName,
          ClientType,
          ...(selectedLodgementType === "Not Lodged" && { DueDate }),
          ...(selectedLodgementType === "Outstanding" && { LastYearLodged }),
        }));

      setTableData(lodgmentTypeData);
    }
  };

  const handleLegendClick = (entry: any) => {
    const newClientTypeData = clientTypeData!.map((item) => {
      if (item.clientType === entry.value) {
        return { ...item, isVisible: !item.isVisible };
      }
      return item;
    });
    const newLatestYearLodgementData = latestYearLodgementData!.map((item) => {
      if (item.name === entry.value) {
        return { ...item, isVisible: !item.isVisible };
      }
      return item;
    });
    setClientTypeData(newClientTypeData);
    setLatestYearLodgementData(newLatestYearLodgementData);
  };

  return (
    <>
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
          className="flex flex-col h-screen bg-gray-800 text-white md:block"
          ref={sidebarRef}
        >
          <div className="py-4 px-6 border-b border-gray-700 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Tax Analyser</h1>
            <button
              id="sidebarToggle"
              className="block md:hidden focus:outline-none absolute top-5 left-1"
              onClick={function (e) {
                sidebarRef.current?.classList.toggle("hidden");
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
            <LogoutButton />
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
      {clientTypeData ? (
        <PieChart width={730} height={250} style={{ cursor: "pointer" }}>
          <Pie
            data={clientTypeData?.filter((item) => item.isVisible)}
            dataKey="count"
            nameKey="clientType"
            fill="#82ca9d"
            label
            labelLine={false}
            onMouseEnter={onPieEnter}
            onClick={onPieClick}
            onMouseLeave={() => setActiveElement(null)}
          >
            {clientTypeData?.map(
              (entry, index) =>
                entry.isVisible && (
                  <Cell
                    key={`cell-${entry.clientType}`}
                    fill={
                      activeElement === null ||
                      activeElement === entry.clientType
                        ? COLORS[index % COLORS.length]
                        : `${COLORS[index % COLORS.length]}80`
                    }
                  />
                )
            )}
          </Pie>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            onClick={handleLegendClick}
            payload={clientTypeData?.map(
              ({ clientType, count, isVisible }, index) => ({
                value: clientType,
                type: "square",
                color: !isVisible
                  ? `${COLORS[index % COLORS.length]}80`
                  : activeElement === null || activeElement === clientType
                  ? COLORS[index % COLORS.length]
                  : `${COLORS[index % COLORS.length]}80`,
              })
            )}
          />
          <Tooltip
            content={
              <CustomTooltip
                active={false}
                payload={[{ name: "", value: "", payload: { fill: "" } }]}
              />
            }
          />
        </PieChart>
      ) : null}
      {latestYearLodgementData ? (
        <PieChart width={730} height={250} style={{ cursor: "pointer" }}>
          <Pie
            data={latestYearLodgementData?.filter((item) => item.isVisible)}
            dataKey="count"
            nameKey="name"
            fill="#82ca9d"
            label
            labelLine={false}
            onMouseEnter={onPieEnter}
            onClick={onPieClick}
            onMouseLeave={() => setActiveElement(null)}
          >
            {latestYearLodgementData?.map(
              (entry, index) =>
                entry.isVisible && (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={
                      activeElement === null || activeElement === entry.name
                        ? COLORS[index % COLORS.length]
                        : `${COLORS[index % COLORS.length]}80`
                    }
                  />
                )
            )}
          </Pie>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            onClick={handleLegendClick}
            payload={latestYearLodgementData?.map(
              ({ name, count, isVisible }, index) => ({
                value: name,
                type: "square",
                color: !isVisible
                  ? `${COLORS[index % COLORS.length]}80`
                  : activeElement === null || activeElement === name
                  ? COLORS[index % COLORS.length]
                  : `${COLORS[index % COLORS.length]}80`,
              })
            )}
          />
          <Tooltip
            content={
              <CustomTooltip
                active={false}
                payload={[{ name: "", value: "", payload: { fill: "" } }]}
              />
            }
          />
        </PieChart>
      ) : null}
      {tableData ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-[0.5px]">
            <thead className="border-[0.5px]">
              <tr>
                <th className="px-4 py-2 text-left font-bold">TFN</th>
                <th className="px-4 py-2 text-left font-bold">Client Name</th>
                <th className="px-4 py-2 text-left font-bold">Client Type</th>
                {!!tableData?.[0]?.DueDate && (
                  <th className="px-4 py-2 text-left font-bold">Due Date</th>
                )}
                {tableData?.[0]?.LastYearLodged !== undefined && (
                  <th className="px-4 py-2 text-left font-bold">
                    Last lodgement year
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableData.map(
                (
                  { TFN, ClientName, ClientType, DueDate, LastYearLodged },
                  index
                ) => (
                  <tr
                    key={TFN}
                    className={`${index % 2 === 1 ? "bg-gray-900" : ""}`}
                  >
                    <td className="px-4 py-2 text-left text-gray-300">{TFN}</td>
                    <td className="px-4 py-2 text-left text-gray-300">
                      {ClientName}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-300">
                      {ClientType}
                    </td>
                    {!!DueDate && (
                      <td className="px-4 py-2 text-left text-gray-300">
                        {DueDate}
                      </td>
                    )}
                    {!!LastYearLodged && (
                      <td className="px-4 py-2 text-left text-gray-300">
                        {LastYearLodged}
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active: boolean;
  payload: [{ name: string; value: string; payload: { fill: string } }];
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-2 bg-gray-100 border-2 opacity-90"
        style={{ borderColor: payload?.[0]?.payload?.fill }}
      >
        <p className="text-black text-sm">
          {`${payload[0].name} : `}
          <b>{`${payload[0].value}`}</b>
        </p>
      </div>
    );
  }
  return null;
};
