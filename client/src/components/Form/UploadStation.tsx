import React, { useRef, useState } from "react";
import { URL } from "../../utility";

const UploadStation = () => {
  const fileStation = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    success: "",
    error: "",
  });
  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    const file = (fileStation as any).current?.files[0];

    if (!file) {
      alert("No station file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(`${URL}/uploadStation`, {
        method: "POST",
        body: formData,
      });

      setStatusMessage({
        ...statusMessage,
        success: "Successfully upload station data!",
      });
    } catch (err) {
      console.log(err);
      setStatusMessage({
        ...statusMessage,
        error: "Cannot upload station data!",
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <h3>Select .csv file for station:</h3>
        <input type="file" ref={fileStation} name="station" />
        <button
          className="custom-btn"
          type="submit"
          disabled={loading}
          name="station"
        >
          Upload Station
        </button>
      </form>
      <div className="status">
        {!!statusMessage.success && (
          <p style={{ color: "green" }}>Status: {statusMessage.success}</p>
        )}
        {!!statusMessage.error && (
          <p style={{ color: "red" }}>Status: {statusMessage.error}</p>
        )}
      </div>
    </div>
  );
};

export default UploadStation;
