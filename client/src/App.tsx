import FileUploadForm from "./components/Form/FileUploadForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/navigation/NavigationBar";
import StationContainer from "./components/Station/StationContainer";
import SingleStation from "./components/Station/SingleStation";
import JourneyContainer from "./components/Journey/JourneyContainer";

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
