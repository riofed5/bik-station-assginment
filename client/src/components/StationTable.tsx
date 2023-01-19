import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const columns = ["Station Name"];

interface PropsTable {
  data: any;
  keyword: string;
  handleChangePage: (text: string) => void;
  page: number;
  totalRows: number;
}

const StationTable = ({
  data,
  keyword,
  handleChangePage,
  page,
  totalRows,
}: PropsTable) => {
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
              Data index from {fromTo?.from} to {fromTo?.to}
            </p>
            <button
              className="btn-prev-page"
              onClick={() => handleChangePage("prev")}
              disabled={page === 1}
            >
              &laquo; Previous
            </button>
            <button
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
              return <th key={i}>{column}</th>;
            })}
          </tr>
          {data.sort().map((singleData: any) => {
            return (
              <tr key={singleData.station_name}>
                <td>
                  <Link to={`/singleStation/${singleData.station_name}`}>
                    {singleData.station_name}
                  </Link>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
      <div className="navigation-container">
        {!keyword && (
          <>
            <button
              className="btn-prev-page"
              onClick={() => handleChangePage("prev")}
              disabled={page === 1}
            >
              &laquo; Previous
            </button>
            <button
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
