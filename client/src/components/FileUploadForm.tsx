import React, { useRef, useState, useEffect } from "react";
import { URL } from "../App";
import JourneyTable from "./JourneyTable";
import StationTable from "./StationTable";

const mockSample = {
  departure_time: "2021-05-31T23:57:25",
  return_time: "2021-06-01T00:05:46",
  departure_station_id: 94,
  departure_station_name: "Laajalahden aukio",
  return_station_id: 100,
  return_station_name: "Teljäntie",
  covered_distance: 2043,
  duration: 500,
};

function FileUploadForm() {
  const fileInput = useRef<HTMLInputElement>(null);

  // Handle File from server
  const [notValidDataFile, setNotValidDataFile] = useState("");
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [totalRowsJourney, setTotalRowsJourney] = useState(0);

  const [journeys, setJourneys] = useState([]);
  const [stations, setStations] = useState([]);

  const [isShowJourney, setIsShowJourney] = useState(true);

  const searchInputRef = useRef(null);

  const [selectedPageJourney, setSelectedPageJourney] = useState(1);
  const [selectedPageStation, setSelectedPageStation] = useState(1);

  // Fetching journeys data based on page
  useEffect(() => {
    fetchJourney(selectedPageJourney);
  }, [selectedPageJourney]);

  // Fetching stations data based on page
  useEffect(() => {
    if (!isShowJourney) {
      fetchStation(selectedPageStation);
    }
  }, [selectedPageStation, isShowJourney]);

  const handleChangeTable = () => {
    setIsShowJourney(!isShowJourney);
  };

  const fetchJourney = async (page = 1) => {
    try {
      const jounreys = await fetch(`${URL}/getJourney?page=${page}`);

      const jouneyJson = await jounreys.json();

      const totalRows = await fetch(`${URL}/getTotalJourney`);

      const totalRowsJson = await totalRows.json();

      setJourneys(jouneyJson);
      setTotalRowsJourney(totalRowsJson[0].totalRow);
    } catch (err) {
      throw new Error("Cannot fetch journeys data::" + err);
    }
  };

  const fetchStation = async (page = 1) => {
    try {
      const response = await fetch(`${URL}/getStation?page=${page}`);

      const json = await response.json();

      setStations(json);
    } catch (err) {
      throw new Error("Cannot fetch stations data::" + err);
    }
  };

  const handleChangePageJourney = (change: string) => {
    if (change === "next") {
      setSelectedPageJourney(selectedPageJourney + 1);
    } else {
      setSelectedPageJourney(selectedPageJourney - 1);
    }
  };

  const handleChangePageStation = (change: string) => {
    if (change === "next") {
      setSelectedPageStation(selectedPageStation + 1);
    } else {
      setSelectedPageStation(selectedPageStation - 1);
    }
  };

  // Handle upload file
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    const file = (fileInput as any).current?.files[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:7000/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data::", data);
        if (data.status) {
          setNotValidDataFile(data.fileName);
          setLoading(false);
        }
      });
  };

  const handleDownloadFile = () => {
    fetch("http://localhost:7000/api/download")
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = `${notValidDataFile}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" ref={fileInput} />
        <button type="submit" disabled={loading}>
          Upload
        </button>
      </form>
      <div>
        {notValidDataFile !== "" && (
          <>
            <p>{notValidDataFile}</p>
            <button onClick={() => handleDownloadFile()}>Download</button>
          </>
        )}
      </div>
      <hr />
      <div>
        <button onClick={handleChangeTable}>
          Show {isShowJourney ? "Station" : "Journey"}
        </button>
      </div>
      <div style={{ margin: "20 0 20 0" }}>
        <h1>Journey data</h1>
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
      <div style={{ margin: "20 0 20 0" }}>
        {isShowJourney ? (
          <JourneyTable
            data={keyword === "" ? journeys : searchedData}
            keyword={keyword}
            handleChangePage={handleChangePageJourney}
            page={selectedPageJourney}
            totalRows={totalRowsJourney}
          />
        ) : (
          <StationTable
            data={keyword === "" ? stations : searchedData}
            keyword={keyword}
            handleChangePage={handleChangePageStation}
            page={selectedPageStation}
            totalRows={500}
          />
        )}
      </div>
    </>
  );
}

export default FileUploadForm;
