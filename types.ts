type DataItem = {
  [key: string]: string | Date;
  ClientType: string;
};

type ClientTypeDataItem = {
  clientType: string;
  count: number;
  isVisible: boolean;
};
