import { useEffect, useState } from "react";
import { handleSortByKey } from "../../utility";

const columns = [
  {
    title: "Departure Station Name",
    sortable: true,
    key: "departure_station_name",
  },
  { title: "Return Station Name", sortable: true, key: "return_station_name" },
  { title: "Covered Distance (Km)", sortable: true, key: "covered_distance" },
  { title: "Duration (Minute)", sortable: true, key: "duration" },
];

interface PropsTable {
  data: any;
  keyword: string;
  handleChangePage: (text: string) => void;
  page: number;
  totalRows: number;
}
const JourneyTable = ({
  data,
  keyword,
  handleChangePage,
  page,
  totalRows,
}: PropsTable) => {
  const [tableData, setTableData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortFromAtoZ, setSortFromAtoZ] = useState(true);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const [fromTo, setFromTo] = useState({ from: 0, to: 0 });
  const [nextBtnDisable, setNextBtnDisable] = useState(false);

  useEffect(() => {
    if (keyword === "") {
      if (data.length > 0) {
        let sortedData = [...data].map((singleData) => singleData.id);
        const min = Math.min(...sortedData);
        const max = Math.max(...sortedData);
        setNextBtnDisable(max === totalRows);
        setFromTo({ from: min, to: max });
      }
    }
  }, [data, keyword]);

  if (data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div className="data-container">
      <div className="search-container">
        {!keyword && (
          <>
            <p>
              Data index from {fromTo?.from} to {fromTo?.to} of {totalRows}
            </p>
            <button
              className="btn-prev-page custom-btn"
              onClick={() => handleChangePage("prev")}
              disabled={page === 1}
            >
              &laquo; Previous
            </button>
            <button
              className="custom-btn"
              onClick={() => handleChangePage("next")}
              disabled={nextBtnDisable}
            >
              Next &raquo;
            </button>
          </>
        )}
      </div>
      <br />
      <div className="table-container">
        <table id="customers">
          <tr>
            {columns.map((column, i) => {
              return (
                <th key={i}>
                  {column.title}{" "}
                  {column.sortable && (
                    <button
                      className="sort-btn"
                      onClick={() => {
                        handleSortByKey(
                          tableData,
                          sortFromAtoZ,
                          column.key,
                          setSortedData
                        );
                        setSortFromAtoZ(!sortFromAtoZ);
                      }}
                    >
                      sort
                    </button>
                  )}
                </th>
              );
            })}
          </tr>
          {(sortedData.length > 0 ? sortedData : tableData).map(
            (singleData: any, index: any) => {
              return (
                <tr key={index}>
                  <td>{singleData.departure_station_name}</td>
                  <td>{singleData.return_station_name}</td>
                  <td>{singleData.covered_distance / 1000}</td>
                  <td>{Math.round(singleData.duration / 60).toFixed(2)}</td>
                </tr>
              );
            }
          )}
        </table>
      </div>
      <div className="navigation-container">
        {!keyword && (
          <>
            <button
              className="btn-prev-page custom-btn"
              onClick={() => handleChangePage("prev")}
              disabled={page === 1}
            >
              &laquo; Previous
            </button>
            <button
              className="custom-btn"
              onClick={() => handleChangePage("next")}
              disabled={nextBtnDisable}
            >
              Next &raquo;
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JourneyTable;
