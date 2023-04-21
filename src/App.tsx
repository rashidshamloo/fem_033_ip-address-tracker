import { useState } from "react";

// react-leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// components
import Header from "./components/Header";
import SetMapCenter from "./components/SetMapCenter";
import Loading from "./components/Loading";
import Credits from "./components/Credits";

// interfaces
export interface position {
  lat: number;
  lng: number;
}

function App() {
  // lat/lng state
  const [position, setPosition] = useState<position>();
  // location state for popup
  const [location, setLocation] = useState<string>();
  // state for keeping track of first map load to show the map after
  const [firstMapLoad, setFirstMapLoad] = useState<boolean>(true);
  // map loading state to show loading animation
  const [mapLoading, setMapLoading] = useState<boolean>(true);

  return (
    <>
      <Header
        setPosition={setPosition}
        setLocation={setLocation}
        setMapLoading={setMapLoading}
      />
      <main className="relative flex-1">
        {mapLoading && <Loading map={true} />}
        <div className={"h-full " + (firstMapLoad ? "opacity-0" : "")}>
          <MapContainer
            className="z-[0] h-full"
            center={[38.8693, -77.0536]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={
                position ? [position.lat, position.lng] : [38.8693, -77.0536]
              }
            >
              <Popup>{location}</Popup>
            </Marker>
            <SetMapCenter
              position={position}
              mode="fly"
              firstMapLoad={firstMapLoad}
              setfirstMapLoad={setFirstMapLoad}
            />
          </MapContainer>
        </div>
      </main>
      <Credits />
    </>
  );
}

export default App;
