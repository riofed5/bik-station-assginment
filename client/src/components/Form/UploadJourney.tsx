import React, { useRef, useState } from "react";
import { URL } from "../../utility";

const UploadJourney = () => {
  const fileJourney = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    success: "",
    error: "",
  });
  // Handle upload file
  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    const file = (fileJourney as any).current?.files[0];

    if (!file) {
      alert("No journey file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(`${URL}/uploadJourney`, {
        method: "POST",
        body: formData,
      });

      setStatusMessage({
        ...statusMessage,
        success: "Successfully upload journey data!",
      });
    } catch (err) {
      console.log(err);
      setStatusMessage({
        ...statusMessage,
        error: "Cannot upload journey data!",
      });
    }
    setLoading(false);
  };
  return (
    <div>
      <form onSubmit={handleUpload}>
        <h3>Select .csv file for journey:</h3>
        <input type="file" ref={fileJourney} name="journey" />
        <button
          className="custom-btn"
          type="submit"
          disabled={loading}
          name="journey"
        >
          Upload Journey
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

export default UploadJourney;
