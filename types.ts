type DataItem = {
  ClientType: string;
  ClientName: string;
  DueDate: string;
  LastYearLodged: number;
  TFN: number;
  [key: string]: string | Date | number;
};

type ClientTypeDataItem = {
  clientType: string;
  count: number;
  isVisible: boolean;
};

type LodgementNames = "Lodged" | "Not Lodged" | "Outstanding" | "Others";

type LatestYearLodgementDistributionItem = {
  name: LodgementNames;
  count: number;
  isVisible: boolean;
};

type TableDataItem = {
  ClientType: string;
  ClientName: string;
  TFN: number;
  DueDate?: string;
  LastYearLodged?: number;
};
