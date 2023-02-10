import { useRef, useState, useEffect } from "react";
import { URL } from "../../utility";
import NewStation from "../Form/NewStation";
import Modal from "../Modal/Modal";
import StationTable from "./StationTable";

const StationContainer = () => {
  const searchInputRef = useRef(null);
  const [loadingData, setLoadingData] = useState(false);

  const [selectedPageStation, setSelectedPageStation] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [totalRowsStation, setTotalRowsStation] = useState(0);
  const [stations, setStations] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchSearchedData = async (keyword: string) => {
    try {
      const resp = await fetch(
        `${URL}/searchStationByName?searchKey=${keyword}`
      );
      const json = await resp.json();

      //Set Search Data
      setSearchedData(json);
    } catch (e) {
      console.error("Failed to fetch search data: " + e);
    }
  };

  // Fetch data based on keyword search
  useEffect(() => {
    if (keyword !== "") {
      fetchSearchedData(keyword);
    }
  }, [keyword]);

  // Fetching stations data based on page
  useEffect(() => {
    fetchStation(selectedPageStation);
  }, []);

  useEffect(() => {
    fetchStation(selectedPageStation);
  }, [selectedPageStation]);

  const fetchStation = async (page = 1) => {
    try {
      setLoadingData(true);

      const response = await fetch(`${URL}/getStation?page=${page}`);
      const json = await response.json();

      const totalRows = await fetch(`${URL}/getTotalStation`);
      const totalRowsJson = await totalRows.json();

      setStations(json);
      setTotalRowsStation(totalRowsJson.totalRow);
      setLoadingData(false);
    } catch (err) {
      console.error("Cannot fetch stations data::" + err);
    }
  };

  const handleChangePageStation = (change: string) => {
    if (change === "next") {
      setSelectedPageStation(selectedPageStation + 1);
    } else {
      setSelectedPageStation(selectedPageStation - 1);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="container">
      <div style={{ margin: "20px 0" }}>
        <h1>Station data</h1>
        <p>
          <input
            ref={searchInputRef}
            type="tex"
            placeholder="Name of Station. Ex: 'Han'"
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            className="input-search"
          />
        </p>
        <button onClick={handleOpenModal}>Add new station</button>
      </div>
      {loadingData ? (
        <p>Data is loading...</p>
      ) : (
        <StationTable
          data={keyword === "" ? stations : searchedData}
          keyword={keyword}
          handleChangePage={handleChangePageStation}
          page={selectedPageStation}
          totalRows={totalRowsStation}
        />
      )}
      <Modal
        styles={{ display: openModal ? "block" : "none" }}
        handleOpenModal={handleOpenModal}
      >
        <NewStation />
      </Modal>
    </div>
  );
};

export default StationContainer;
