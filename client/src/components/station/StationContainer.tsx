import { useRef, useState, useEffect } from "react";
import { URL } from "../../utility";
import StationTable from "./StationTable";

const StationContainer = () => {
  const searchInputRef = useRef(null);

  const [selectedPageStation, setSelectedPageStation] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [totalRowsStation, setTotalRowsStation] = useState(0);
  const [stations, setStations] = useState([]);

  // Fetching stations data based on page
  useEffect(() => {
    fetchStation(selectedPageStation);
  }, [selectedPageStation]);

  const fetchStation = async (page = 1) => {
    try {
      const response = await fetch(`${URL}/getStation?page=${page}`);
      const json = await response.json();

      const totalRows = await fetch(`${URL}/getTotalStation`);
      const totalRowsJson = await totalRows.json();

      setStations(json);
      setTotalRowsStation(totalRowsJson.totalRow);
    } catch (err) {
      throw new Error("Cannot fetch stations data::" + err);
    }
  };

  const handleChangePageStation = (change: string) => {
    if (change === "next") {
      setSelectedPageStation(selectedPageStation + 1);
    } else {
      setSelectedPageStation(selectedPageStation - 1);
    }
  };
  return (
    <div className="container">
      <div style={{ margin: "20px 0" }}>
        <h1>Station data</h1>
        <p>
          <input
            ref={searchInputRef}
            type="tex"
            placeholder="Search"
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            className="input-search"
          />
        </p>
      </div>
      <StationTable
        data={keyword === "" ? stations : searchedData}
        keyword={keyword}
        handleChangePage={handleChangePageStation}
        page={selectedPageStation}
        totalRows={totalRowsStation}
      />
    </div>
  );
};

export default StationContainer;
