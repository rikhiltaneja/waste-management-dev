"use client";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import { MapPin, Clock, AlertTriangle, CheckCircle } from "lucide-react";

// Original garbage bag icon
const garbageIcon = new L.Icon({
  iconUrl: "/garbage-bag.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const facilities = [
  {
    id: 1,
    name: "Central Collection Point",
    position: [31.289135, 75.628595] as [number, number],
    status: "active",
    capacity: 85,
    lastCollection: "2 hours ago",
    type: "Primary Hub",
    address: "Main Street, Downtown"
  },
  {
    id: 2,
    name: "North District Center",
    position: [31.287314, 75.625381] as [number, number],
    status: "full",
    capacity: 100,
    lastCollection: "6 hours ago",
    type: "District Hub",
    address: "North Avenue, Sector 12"
  },
  {
    id: 3,
    name: "Community Drop-off",
    position: [31.290933, 75.619088] as [number, number],
    status: "active",
    capacity: 45,
    lastCollection: "1 hour ago",
    type: "Community Point",
    address: "Park Road, Residential Area"
  },
  {
    id: 4,
    name: "Industrial Zone Hub",
    position: [31.285, 75.630] as [number, number],
    status: "maintenance",
    capacity: 0,
    lastCollection: "1 day ago",
    type: "Industrial Hub",
    address: "Industrial Complex, Zone A"
  }
];

export default function Map() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "full":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "maintenance":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "full":
        return "text-red-600 bg-red-50 border-red-200";
      case "maintenance":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div id="map" className="h-full w-full">
      <MapContainer
        center={[31.289135, 75.628595]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        doubleClickZoom={true}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {facilities.map((facility) => (
          <Marker
            key={facility.id}
            position={facility.position}
            icon={garbageIcon}
          >
            <Popup minWidth={280} maxWidth={320}>
              <div className="p-2">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{facility.address}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(facility.status)}`}>
                    {getStatusIcon(facility.status)}
                    {facility.status}
                  </div>
                </div>
                
                {/* Image that shows on hover/popup */}
                <div className="mb-3">
                  <img
                    src="/garbage-image.png"
                    alt="Facility Image"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium">{facility.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          facility.capacity >= 90 ? 'bg-red-500' :
                          facility.capacity >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${facility.capacity}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 block">Type</span>
                      <span className="font-medium">{facility.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Last Collection</span>
                      <span className="font-medium">{facility.lastCollection}</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* User location marker */}
        <CircleMarker
          center={[31.289135, 75.628595]}
          pathOptions={{ 
            fillColor: "bg-primary", 
            color: "#ffffff",
            weight: 3,
            fillOpacity: 0.8 
          }}
          radius={8}
        >
          <Popup>
            <div className="text-center">
              <MapPin className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <p className="font-medium">Your Location</p>
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
