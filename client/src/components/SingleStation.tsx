import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { URL } from "../App";

type StationParams = {
  nameOfStation: string;
};

const SingleStation = () => {
  const { nameOfStation } = useParams<StationParams>();
  const [detail, setDetail] = useState({
    name: "",
    numberOfJourneyStartFrom: 0,
    numberOfJourneyEndingAt: 0,
    distanceOfJouneyStartFromStation: 0,
    distanceOfJouneyEndAtStation: 0,
    top5Depart: [] as any[],
    top5Return: [] as any[],
  });

  const fetchDetailStation = async (stationName: string) => {
    try {
      const startFromStation = await fetch(
        `${URL}/getDetailOfDepartStation?station=${stationName}`
      );
      const startFromStationJson = await startFromStation.json();

      const endAtStation = await fetch(
        `${URL}/getDetailOfReturnStation?station=${stationName}`
      );

      const endAtStationJson = await endAtStation.json();

      const top5DepatureStationFromStation = await fetch(
        `${URL}/getTop5DepartStationEndingAtStation?station=${stationName}`
      );

      const top5DepartJson = await top5DepatureStationFromStation.json();

      const top5Depart = [...top5DepartJson].map(
        (el) => el.departure_station_name
      );
      const top5ReturnStationFromStation = await fetch(
        `${URL}/getTop5ReturnStationStartFromStation?station=${stationName}`
      );

      const top5ReturnJson = await top5ReturnStationFromStation.json();

      const top5Return = [...top5ReturnJson].map(
        (el) => el.return_station_name
      );

      setDetail({
        name: stationName,
        numberOfJourneyStartFrom: startFromStationJson[0].count,
        numberOfJourneyEndingAt: endAtStationJson[0].count,
        distanceOfJouneyStartFromStation:
          startFromStationJson[0].total_distance,
        distanceOfJouneyEndAtStation: endAtStationJson[0].total_distance,
        top5Depart: top5Depart,
        top5Return: top5Return,
      });
    } catch (err) {
      throw new Error("Fetching detail of station failed: " + err);
    }
  };

  useEffect(() => {
    if (nameOfStation) {
      fetchDetailStation(nameOfStation);
    }
  }, [nameOfStation]);

  return (
    <div>
      <h1>{nameOfStation}</h1>
      <ul>
        <li>Name of station: {nameOfStation}</li>

        <li>
          Total number of journeys starting from the station :{" "}
          {detail.numberOfJourneyStartFrom}
        </li>
        <li>
          Total number of journeys ending at the station :{" "}
          {detail.numberOfJourneyEndingAt}
        </li>
        <li>
          The average distance of a journey starting from the station :{" "}
          {detail.distanceOfJouneyStartFromStation / 1000} km
        </li>
        <li>
          The average distance of a journey ending at the station :{" "}
          {detail.distanceOfJouneyEndAtStation / 1000} km
        </li>
        <li>
          Top 5 most popular departure stations for journeys ending at the
          station
          <ul>
            {detail.top5Depart.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </li>
        <li>
          Top 5 most popular return stations for journeys starting from the
          station
          <ul>
            {detail.top5Return.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default SingleStation;
