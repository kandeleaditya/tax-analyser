'use client';

import SidePanel from '@/components/side-panel';
import { useState } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

const parseDate = (dateString: string) => {
  const parts = dateString.split('/');

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  return date;
};

const isCurrentDateGreaterThan = (dateString: string) => {
  const passedDate = parseDate(dateString);

  const currentDate = new Date();

  console.log('dateString', dateString);
  console.log('currentDate', currentDate);
  console.log('passedDate', passedDate);

  return currentDate > passedDate;
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [data, setData] = useState<DataItem[]>();
  const [clientTypeData, setClientTypeData] = useState<ClientTypeDataItem[]>();
  const [latestYearLodgementData, setLatestYearLodgementData] = useState<LatestYearLodgementDistributionItem[]>();
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableDataItem[]>();
  const [latestYear, setLatestYear] = useState<number>(0);

  const COLORS = [
    '#6C8EBF',
    '#A1E8AF',
    '#FFB6C1',
    '#E6E6FA',
    '#FFD700',
    '#FF7F50',
    '#008080',
    '#C8A2C8',
    '#87CEEB',
    '#FFA07A',
    '#98FB98',
    '#DDA0DD',
    '#B0E0E6',
    '#FFE4C4',
    '#7FFFD4',
    '#F0E68C',
    '#D2B48C',
    '#00FF7F',
    '#AFEEEE',
    '#FF6347',
  ];

  const onPieEnter = (entry: { name: string }, index: number) => {
    setActiveElement(entry.name);
  };

  const onPieClick = (e: any) => {
    console.log('e', e);
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
          if (selectedLodgementType === 'Lodged') {
            return dataItem[latestYear] === 'Received';
          } else if (selectedLodgementType === 'Not Lodged') {
            return dataItem[latestYear] === 'Not Received' && !isCurrentDateGreaterThan(dataItem.DueDate);
          } else if (selectedLodgementType === 'Outstanding') {
            return dataItem[latestYear] === 'Not Received' && isCurrentDateGreaterThan(dataItem.DueDate);
          } else {
            return dataItem[latestYear] !== 'Received' && dataItem[latestYear] !== 'Not Received';
          }
        })
        .map(({ TFN, ClientName, ClientType, DueDate, LastYearLodged }) => ({
          TFN,
          ClientName,
          ClientType,
          ...(selectedLodgementType === 'Not Lodged' && { DueDate }),
          ...(selectedLodgementType === 'Outstanding' && { LastYearLodged }),
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
        <SidePanel />

        {clientTypeData ? (
          <PieChart width={730} height={250} style={{ cursor: 'pointer' }}>
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
                        activeElement === null || activeElement === entry.clientType
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
              payload={clientTypeData?.map(({ clientType, count, isVisible }, index) => ({
                value: clientType,
                type: 'square',
                color: !isVisible
                  ? `${COLORS[index % COLORS.length]}80`
                  : activeElement === null || activeElement === clientType
                    ? COLORS[index % COLORS.length]
                    : `${COLORS[index % COLORS.length]}80`,
              }))}
            />
            <Tooltip
              content={<CustomTooltip active={false} payload={[{ name: '', value: '', payload: { fill: '' } }]} />}
            />
          </PieChart>
        ) : null}
        {latestYearLodgementData ? (
          <PieChart width={730} height={250} style={{ cursor: 'pointer' }}>
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
              payload={latestYearLodgementData?.map(({ name, count, isVisible }, index) => ({
                value: name,
                type: 'square',
                color: !isVisible
                  ? `${COLORS[index % COLORS.length]}80`
                  : activeElement === null || activeElement === name
                    ? COLORS[index % COLORS.length]
                    : `${COLORS[index % COLORS.length]}80`,
              }))}
            />
            <Tooltip
              content={<CustomTooltip active={false} payload={[{ name: '', value: '', payload: { fill: '' } }]} />}
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
                  {!!tableData?.[0]?.DueDate && <th className="px-4 py-2 text-left font-bold">Due Date</th>}
                  {tableData?.[0]?.LastYearLodged !== undefined && (
                    <th className="px-4 py-2 text-left font-bold">Last lodgement year</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData.map(({ TFN, ClientName, ClientType, DueDate, LastYearLodged }, index) => (
                  <tr key={TFN} className={`${index % 2 === 1 ? 'bg-gray-900' : ''}`}>
                    <td className="px-4 py-2 text-left text-gray-300">{TFN}</td>
                    <td className="px-4 py-2 text-left text-gray-300">{ClientName}</td>
                    <td className="px-4 py-2 text-left text-gray-300">{ClientType}</td>
                    {!!DueDate && <td className="px-4 py-2 text-left text-gray-300">{DueDate}</td>}
                    {!!LastYearLodged && <td className="px-4 py-2 text-left text-gray-300">{LastYearLodged}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>
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
      <div className="p-2 bg-gray-100 border-2 opacity-90" style={{ borderColor: payload?.[0]?.payload?.fill }}>
        <p className="text-black text-sm">
          {`${payload[0].name} : `}
          <b>{`${payload[0].value}`}</b>
        </p>
      </div>
    );
  }
  return null;
};
