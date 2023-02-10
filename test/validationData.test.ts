import {
  journeyValidation,
  stationValidation,
} from "../src/controllers/helper";

describe("journey data validation tests", () => {
  const journey = {
    departure_time: "2021-05-31T23:57:25",
    return_time: "2021-06-01T00:05:46",
    departure_station_id: 94,
    departure_station: "Laajalahden aukio",
    return_station_id: 100,
    return_station: "Teljäntie",
    distance: 2043,
    duration: 500,
  };
  it("accepts valid journey data", () => {
    const result = journeyValidation(
      journey.departure_time,
      journey.return_time,
      journey.departure_station_id,
      journey.departure_station,
      journey.return_station_id,
      journey.return_station,
      journey.distance,
      journey.duration
    );
    expect(result).toBe(true);
  });

  it("rejects when data contains invalid departure time", () => {
    const invalidDepartureTime = "2021-05-35T23:57:25";
    const result = journeyValidation(
      invalidDepartureTime,
      journey.return_time,
      journey.departure_station_id,
      journey.departure_station,
      journey.return_station_id,
      journey.return_station,
      journey.distance,
      journey.duration
    );
    expect(result).toBe(false);
  });

  it("rejects when data contains invalid return time", () => {
    const invalidReturnTime = "2021-05-35T23:57:25";
    const result = journeyValidation(
      journey.departure_time,
      invalidReturnTime,
      journey.departure_station_id,
      journey.departure_station,
      journey.return_station_id,
      journey.return_station,
      journey.distance,
      journey.duration
    );
    expect(result).toBe(false);
  });
  it("rejects when data contains return time earlier than departure time", () => {
    const ealierReturnTime = "2021-05-30T23:57:25";
    const result = journeyValidation(
      journey.departure_time,
      ealierReturnTime,
      journey.departure_station_id,
      journey.departure_station,
      journey.return_station_id,
      journey.return_station,
      journey.distance,
      journey.duration
    );
    expect(result).toBe(false);
  });
  it("rejects when data contains invalid departure station id", () => {
    const invalidDepartureStationId = 0;
    const result = journeyValidation(
      journey.departure_time,
      journey.return_time,
      invalidDepartureStationId,
      journey.departure_station,
      journey.return_station_id,
      journey.return_station,
      journey.distance,
      journey.duration
    );
    expect(result).toBe(false);
  });
  it("rejects when data contains invalid departure station name", () => {
    const invalidDepartureStation = "";
    const result = journeyValidation(
      journey.departure_time,
      journey.return_time,
      journey.departure_station_id,
      invalidDepartureStation,
      journey.return_station_id,
      journey.return_station,
      journey.distance,
      journey.duration
    );
    expect(result).toBe(false);
  });
  it("rejects when data contains invalid return station id", () => {
    const invalidReturnStationId = 0;
    const result = journeyValidation(
      journey.departure_time,
      journey.return_time,
      journey.departure_station_id,
      journey.departure_station,
      invalidReturnStationId,
      journey.return_station,
      journey.distance,
      journey.duration
    );
    expect(result).toBe(false);
  });
  it("rejects when data contains invalid return station", () => {
    const invalidReturnStation = "";
    const result = journeyValidation(
      journey.departure_time,
      journey.return_time,
      journey.departure_station_id,
      journey.departure_station,
      journey.return_station_id,
      invalidReturnStation,
      journey.distance,
      journey.duration
    );
    expect(result).toBe(false);
  });
  it("accepts when data contains distance equals 10 meters", () => {
    const distance = 10;
    const result = journeyValidation(
      journey.departure_time,
      journey.return_time,
      journey.departure_station_id,
      journey.departure_station,
      journey.return_station_id,
      journey.return_station,
      distance,
      journey.duration
    );
    expect(result).toBe(true);
  });
  it("rejects when data contains distance shorter than 10 meters", () => {
    const distance = 9;
    const result = journeyValidation(
      journey.departure_time,
      journey.return_time,
      journey.departure_station_id,
      journey.departure_station,
      journey.return_station_id,
      journey.return_station,
      distance,
      journey.duration
    );
    expect(result).toBe(false);
  });
  it("accepts when data contains duration equals 10 seconds", () => {
    const duration = 10;
    const result = journeyValidation(
      journey.departure_time,
      journey.return_time,
      journey.departure_station_id,
      journey.departure_station,
      journey.return_station_id,
      journey.return_station,
      journey.distance,
      duration
    );
    expect(result).toBe(true);
  });
  it("rejects when data contains duration shorter than 10 seconds", () => {
    const duration = 9;
    const result = journeyValidation(
      journey.departure_time,
      journey.return_time,
      journey.departure_station_id,
      journey.departure_station,
      journey.return_station_id,
      journey.return_station,
      journey.distance,
      duration
    );
    expect(result).toBe(false);
  });
});

describe("station data validation tests", () => {
  const station = {
    id: 1,
    name: "Hanasaari",
    address: "Hanasaarenranta 1",
    x: 24.840319,
    y: 60.16582,
  };
  it("accepts valid station data", () => {
    const result = stationValidation(
      station.id,
      station.name,
      station.address,
      station.x,
      station.y
    );
    expect(result).toBe(true);
  });
  it("rejects station data contains non-integer id", () => {
    const invalidId = 2.17;
    const result = stationValidation(
      invalidId,
      station.name,
      station.address,
      station.x,
      station.y
    );
    expect(result).toBe(false);
  });
  it("rejects station data contains zero as id", () => {
    const invalidId = 0;
    const result = stationValidation(
      invalidId,
      station.name,
      station.address,
      station.x,
      station.y
    );
    expect(result).toBe(false);
  });
  it("rejects station data contains integer smaller than zero as id", () => {
    const invalidId = -1;
    const result = stationValidation(
      invalidId,
      station.name,
      station.address,
      station.x,
      station.y
    );
    expect(result).toBe(false);
  });
  it("rejects station data contains empty name", () => {
    const emptyName = "";
    const result = stationValidation(
      station.id,
      emptyName,
      station.address,
      station.x,
      station.y
    );
    expect(result).toBe(false);
  });
  it("rejects station data contains empty address", () => {
    const emptyAddress = "";
    const result = stationValidation(
      station.id,
      station.name,
      emptyAddress,
      station.x,
      station.y
    );
    expect(result).toBe(false);
  });
  it("rejects station data contains latitude outside finland's litmit", () => {
    const invalidLatitude = 80;
    const result = stationValidation(
      station.id,
      station.name,
      station.address,
      station.x,
      invalidLatitude
    );
    expect(result).toBe(false);
  });
  it("rejects station data contains longitude outside finland's litmit", () => {
    const invalidLongitude = 5;
    const result = stationValidation(
      station.id,
      station.name,
      station.address,
      invalidLongitude,
      station.y
    );
    expect(result).toBe(false);
  });
});
