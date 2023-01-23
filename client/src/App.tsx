import FileUploadForm from "./components/FileUploadForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import StationContainer from "./components/station/StationContainer";
import SingleStation from "./components/station/SingleStation";
import JourneyContainer from "./components/journey/JourneyContainer";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<FileUploadForm />} />
        <Route path="/journeys" element={<JourneyContainer />} />
        <Route path="/stations" element={<StationContainer />} />

        <Route
          path="/singleStation/:nameOfStation"
          element={<SingleStation />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
