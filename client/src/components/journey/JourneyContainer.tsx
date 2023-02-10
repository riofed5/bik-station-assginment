import { useRef, useState, useEffect } from "react";
import { URL } from "../../utility";
import JourneyTable from "./JourneyTable";

const JourneyContainer = () => {
  const searchInputRef = useRef(null);

  const [loadingData, setLoadingData] = useState(false);
  const [selectedPageJourney, setSelectedPageJourney] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [totalRowsJourney, setTotalRowsJourney] = useState(0);

  const [journeys, setJourneys] = useState([]);

  const fetchSearchedData = async (keyword: string) => {
    try {
      const resp = await fetch(
        `${URL}/searchJourneyByKeywords?searchKey=${keyword}`
      );
      const json = await resp.json();

      //Set Search Data
      setSearchedData(json);
    } catch (e) {
      console.error("Fetch serach data is failed:", e);
    }
  };

  // Fetch data based on keyword search
  useEffect(() => {
    if (keyword !== "") {
      fetchSearchedData(keyword);
    }
  }, [keyword]);

  // Fetching journeys data based on page
  useEffect(() => {
    fetchJourney(selectedPageJourney);
  }, []);

  useEffect(() => {
    fetchJourney(selectedPageJourney);
  }, [selectedPageJourney]);

  const fetchJourney = async (page = 1) => {
    try {
      setLoadingData(true);

      const jounreys = await fetch(`${URL}/getJourney?page=${page}`);
      const jouneyJson = await jounreys.json();

      const totalRows = await fetch(`${URL}/getTotalJourney`);
      const totalRowsJson = await totalRows.json();

      setJourneys(jouneyJson);
      setTotalRowsJourney(totalRowsJson.totalRow);
      setLoadingData(false);
    } catch (err) {
      setLoadingData(false);
      console.error("Cannot fetch journeys data::" + err);
    }
  };

  const handleChangePageJourney = (change: string) => {
    if (change === "next") {
      setSelectedPageJourney(selectedPageJourney + 1);
    } else {
      setSelectedPageJourney(selectedPageJourney - 1);
    }
  };

  return (
    <div className="container">
      <div style={{ margin: "20px 0 " }}>
        <h1>Journey data</h1>
        <p>
          <input
            ref={searchInputRef}
            type="tex"
            placeholder="Ex: Töölöntulli Pasilan asema 1870"
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            className="input-search"
          />
        </p>
      </div>
      {loadingData ? (
        <p>Data is loading...</p>
      ) : (
        <JourneyTable
          data={keyword === "" ? journeys : searchedData}
          keyword={keyword}
          handleChangePage={handleChangePageJourney}
          page={selectedPageJourney}
          totalRows={totalRowsJourney}
        />
      )}
    </div>
  );
};

export default JourneyContainer;

// SELECT id,departure_time,return_time, departure_station_name, return_station_name, covered_distance, duration FROM data WHERE ( departure_station_name like '%Teljäntie%' or return_station_name like '%Teljäntie%' or covered_distance like '%Teljäntie%' ) AND ( departure_station_name like '%2043%' or return_station_name like '%2043%' or covered_distance like '%2043%' ) LIMIT 50
