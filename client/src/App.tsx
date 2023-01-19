import FileUploadForm from "./components/FileUploadForm";
import { Routes, Route } from "react-router-dom";
import SingleStation from "./components/SingleStation";

export const URL = "http://localhost:7000/api";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FileUploadForm />} />
      <Route path="/singleStation/:nameOfStation" element={<SingleStation />} />
    </Routes>
  );
}

export default App;

// CREATE INDEX return_station_name_index ON data (return_station_name);
// CREATE INDEX departure_station_name_index ON data (departure_station_name);
// CREATE INDEX covered_distance_index ON data (covered_distance);
