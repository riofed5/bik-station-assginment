import { JourneyData, StationData } from "./types";

export const URL = "http://localhost:7000/api";

type DataType = StationData[] | JourneyData[];

export const handleSortByKey = (
  arrayData: DataType,
  sortOrder: boolean,
  key: string,
  setData: (data: any) => void
) => {
  const sortedData = arrayData.sort(function (a: any, b: any) {
    const el1 = a[key];
    const el2 = b[key];
    return sortOrder
      ? el1 < el2
        ? -1
        : el1 > el2
        ? 1
        : 0
      : el1 < el2
      ? el1 > el2
        ? 1
        : 0
      : -1;
  });

  setData(sortedData);
};

export const fetchSpecificData = async (
  endpoint: string,
  stationName: string
) => {
  const response = await fetch(`${URL}/${endpoint}?station=${stationName}`);

  const json = await response.json();

  return json;
};
