import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PropsStationTable, StationData } from "../../types";
import { handleSortByKey } from "../../utility";

const columns = [
  { title: "Station Name", sortable: true, key: "Nimi" },
  { title: "Station ID", sortable: true, key: "ID" },
];

const StationTable = ({
  data,
  keyword,
  handleChangePage,
  page,
  totalRows,
}: PropsStationTable) => {
  const [tableData, setTableData] = useState<StationData[]>([]);
  const [sortedData, setSortedData] = useState<StationData[]>([]);
  const [fromTo, setFromTo] = useState({ from: 0, to: 0 });
  const [nextBtnDisable, setNextBtnDisable] = useState(false);

  const [sortFromAtoZ, setSortFromAtoZ] = useState(true);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (keyword === "") {
      if (data.length > 0) {
        let sortedData = [...data].map((singleData) => singleData.FID);
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
                      (a to z)
                    </button>
                  )}
                </th>
              );
            })}
          </tr>
          {(sortedData.length > 0 ? sortedData : tableData).map(
            (singleData: StationData) => {
              return (
                <tr key={singleData.Nimi}>
                  <td>
                    <Link to={`/singleStation/${singleData.Nimi}`}>
                      {singleData.Nimi}
                    </Link>
                  </td>
                  <td>{singleData.ID}</td>
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

export default StationTable;
