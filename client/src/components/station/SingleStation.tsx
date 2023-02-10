import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fetchSpecificData } from "../../utility";
import { StationParams } from "../../types";
import CustomMap from "../Map/CustomMap";

const SingleStation = () => {
  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

  const { nameOfStation } = useParams<StationParams>();
  const [detail, setDetail] = useState({
    name: "",
    address: "",
  });

  const [additionalDetail, setAdditionalDetail] = useState({
    numberOfJourneyStartFrom: 0,
    numberOfJourneyEndingAt: 0,
    distanceOfJouneyStartFromStation: 0,
    distanceOfJouneyEndAtStation: 0,
    top5Depart: [] as string[],
    top5Return: [] as string[],
  });

  const [position, setPosition] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);

  const fetchDetail = async (stationName = "") => {
    try {
      const address = await fetchSpecificData("getAddressStation", stationName);

      const addressString = `${address.Adress}`;

      setDetail({
        name: stationName,
        address: addressString,
      });

      setPosition({ lng: address.x, lat: address.y });
    } catch (err) {
      console.error("Fetching detail of station failed: " + err);
    }
  };

  const fetchAdditionalDetail = async (stationName = "") => {
    try {
      const startFromStation = await fetchSpecificData(
        "getDetailOfDepartStation",
        stationName
      );

      const endAtStation = await fetchSpecificData(
        "getDetailOfReturnStation",
        stationName
      );

      const top5DepatureStationFromStation = await fetchSpecificData(
        "getTop5DepartStationEndingAtStation",
        stationName
      );

      const top5Depart = [...top5DepatureStationFromStation].map(
        (el) => el.departure_station_name
      );
      const top5ReturnStationFromStation = await fetchSpecificData(
        "getTop5ReturnStationStartFromStation",
        stationName
      );

      const top5Return = [...top5ReturnStationFromStation].map(
        (el) => el.return_station_name
      );

      setAdditionalDetail({
        numberOfJourneyStartFrom: startFromStation[0].count,
        numberOfJourneyEndingAt: endAtStation[0].count,
        distanceOfJouneyStartFromStation: startFromStation[0].total_distance,
        distanceOfJouneyEndAtStation: endAtStation[0].total_distance,
        top5Depart: top5Depart,
        top5Return: top5Return,
      });
    } catch (err) {
      console.error("Fetching detail of station failed: " + err);
    }
  };

  useEffect(() => {
    if (nameOfStation) {
      fetchDetail(nameOfStation);
      fetchAdditionalDetail(nameOfStation);
    }
  }, [nameOfStation]);

  return (
    <div className="container">
      <h1>{nameOfStation}</h1>
      <ul>
        <li>Name of station: {nameOfStation}</li>
        <li>Address : {detail.address}</li>
        <li>
          Total number of journeys starting from the station :{" "}
          {additionalDetail.numberOfJourneyStartFrom}
        </li>
        <li>
          Total number of journeys ending at the station :{" "}
          {additionalDetail.numberOfJourneyEndingAt}
        </li>
        <li>
          The average distance of a journey starting from the station :{" "}
          {additionalDetail.distanceOfJouneyStartFromStation / 1000} km
        </li>
        <li>
          The average distance of a journey ending at the station :{" "}
          {additionalDetail.distanceOfJouneyEndAtStation / 1000} km
        </li>
        <li>
          Top 5 most popular departure stations for journeys ending at the
          station
          <ul>
            {additionalDetail.top5Depart.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </li>
        <li>
          Top 5 most popular return stations for journeys starting from the
          station
          <ul>
            {additionalDetail.top5Return.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </li>
      </ul>
      <div>{position && <CustomMap position={position} />}</div>
    </div>
  );
};

export default SingleStation;
