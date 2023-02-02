import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useMemo } from "react";
import { PropsCustomMap } from "../../types";
import "./map.css";

function CustomMap({ position }: PropsCustomMap) {
  const center = useMemo(() => ({ lng: position.lng, lat: position.lat }), []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY as string,
  });

  const renderMap = () => {
    return (
      <GoogleMap
        zoom={15}
        center={center}
        mapContainerClassName="map-container"
      >
        <Marker position={center} />
      </GoogleMap>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <div>Loading</div>;
}

export default CustomMap;
