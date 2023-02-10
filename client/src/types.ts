export type PropsCustomMap = {
  position: { lng: number; lat: number };
};

export type ResponseType = {
  statusCode: number;
  body: {};
};

export type StationData = {
  FID: number;
  ID: number;
  Nimi: string;
  Address: string;
  x: number;
  y: number;
};

export type JourneyData = {
  id: number;
  departure_time: string;
  return_time: string;
  departure_station_id: number;
  departure_station_name: string;
  return_station_id: number;
  return_station_name: string;
  covered_distance: number;
  duration: number;
};

export type PropsJourneyTable = {
  data: JourneyData[];
  keyword: string;
  handleChangePage: (text: string) => void;
  page: number;
  totalRows: number;
};

export type PropsStationTable = {
  data: StationData[];
  keyword: string;
  handleChangePage: (text: string) => void;
  page: number;
  totalRows: number;
};

export type StationParams = {
  nameOfStation: string;
};
