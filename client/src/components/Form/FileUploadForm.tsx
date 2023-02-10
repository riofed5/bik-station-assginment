import UploadJourney from "./UploadJourney";
import UploadStation from "./UploadStation";

function FileUploadForm() {
  return (
    <div className="container">
      <div className="subContainer">
        <UploadJourney />
        <hr />
        <UploadStation />
      </div>
    </div>
  );
}

export default FileUploadForm;
