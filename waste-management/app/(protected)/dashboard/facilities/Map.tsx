"use client";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  GeoJSON,
  Marker,
} from "react-leaflet";
import MapChild from "./MapChild";
import type { FeatureCollection } from "geojson";
import L from "leaflet";

export default function Map() {
  const garbageIcon = new L.Icon({
    iconUrl: "/garbage-bag.png", // path to your icon image
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which corresponds to marker's location
    popupAnchor: [0, -32], // point from which the popup should open relative to the icon
  });
  // const geoJsonData: FeatureCollection = {
  //   type: "FeatureCollection",
  //   features: [
  //     {
  //       type: "Feature",
  //       properties: { name: "Test Area" },
  //       geometry: {
  //         type: "Polygon",
  //         coordinates: [
  //           [
  //             [75.6367, 31.27], // top-right
  //             [75.6367, 31.2697], // bottom-right
  //             [75.6363, 31.2697], // bottom-left
  //             [75.6363, 31.27], // top-left
  //             [75.6367, 31.27], // close polygon
  //           ],
  //         ],
  //       },
  //     },
  //   ],
  // };
  return (
    <div id="map">
      <MapContainer
        center={[31.289135, 75.628595]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <CircleMarker
          center={[31.270036629572292, 75.63697810461257]}
          pathOptions={{ fillColor: "blue" }}
          radius={10}
        >
          <Popup>CIRCLE</Popup>
        </CircleMarker>
        <GeoJSON data={geoJsonData}/> */}
        <Marker position={[31.289135, 75.628595]}>
          <Popup>Your location</Popup>
        </Marker>
        <Marker position={[31.287314, 75.625381]} icon={garbageIcon}>
          <Popup minWidth={250}>
            <div>
              <p className="text-center m-0.5">Dumping Site</p>
              <img
                src={"/garbage-image.png"}
                width="250px"
                className="rounded-md"
              />
            </div>
          </Popup>
        </Marker>
        <Marker position={[31.290933, 75.619088]} icon={garbageIcon}>
          <Popup>
            Dumping Site
          </Popup>
        </Marker>
        {/* <MapChild /> */}
      </MapContainer>
    </div>
  );
}
