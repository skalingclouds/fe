import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { LineChart, AreaChart, BarChart, XAxis, YAxis, CartesianGrid, Line, Area, Bar } from "recharts";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Select, Checkbox, Label, Input } from "@/components/ui";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const GOOGLE_MAPS_API_KEY = publicRuntimeConfig.GOOGLE_MAPS_API_KEY;

const DynamicMap = dynamic(() => import('@react-google-maps/api').then((mod) => mod.GoogleMap), {
  ssr: false
});

function MainComponent() {
  const [searchRange, setSearchRange] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [mlsStatuses, setMlsStatuses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });

  const searchRangeOptions = [
    "1_MONTH",
    "2_MONTH",
    "3_MONTH",
    "6_MONTH",
    "1_YEAR",
  ];
  const propertyTypesOptions = [
    "SRF",
    "MFR",
    "LAND",
    "CONDO",
    "MOBILE",
    "OTHER",
  ];
  const mlsStatusesOptions = ["ml_active", "ml_pending", "mls_cancelled"];
  const filtersPart1 = [
    "auction",
    "absentee_owner",
    "adjustable_rate",
    "cash_buyer",
    "corporate_owned",
    "death",
    "equity",
    "foreclosure",
    "free_clear",
    "high_equity",
    "inherited",
    "in_state_owner",
    "investor_buyer",
    "judgment",
    "out_of_state_owner",
    "pool",
    "pre_foreclosure",
    "private_lender",
    "reo",
    "tax_lien",
    "vacant",
  ];
  const minMaxInputs = [
    "mls_days_on_market",
    "baths",
    "beds",
    "building_size",
    "value",
    "year_built",
    "years_owned",
  ];
  const locationFilters = [
    { name: "Address", field: "address", hint: "123 Main St" },
    { name: "State", field: "state", hint: "CA" },
    { name: "House", field: "house", hint: "123" },
    { name: "Street", field: "street", hint: "Main St" },
    { name: "City", field: "city", hint: "Anytown" },
    { name: "County", field: "county", hint: "Example County" },
    { name: "Zip (comma-seperated)", field: "zip", hint: "91234" },
  ];
  const chartData = [
    { name: "Address 1", value: 25 },
    { name: "Address 2", value: 40 },
    { name: "Address 3", value: 15 },
  ];

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Dashboardb3
        searchRange={searchRange}
        setSearchRange={setSearchRange}
        propertyTypes={propertyTypes}
        setPropertyTypes={setPropertyTypes}
        mlsStatuses={mlsStatuses}
        setMlsStatuses={setMlsStatuses}
        locationFilters={locationFilters}
        propertyTypesOptions={propertyTypesOptions}
        filtersPart1={filtersPart1}
        minMaxInputs={minMaxInputs}
        searchRangeOptions={searchRangeOptions}
        mlsStatusesOptions={mlsStatusesOptions}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-white">
          <LineChart width={300} height={200} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="value" stroke="#dbd8e3" />
          </LineChart>
        </div>
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-white">
          <AreaChart width={300} height={200} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#5c5470"
              fill="#352f44"
            />
          </AreaChart>
        </div>
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-white">
          <BarChart width={300} height={200} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Bar dataKey="value" fill="#dbd8e3" />
          </BarChart>
        </div>
      </div>
      <div className="mt-8 h-[400px]">
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={12}
            options={{ mapTypeId: 'satellite' }}
          />
        </LoadScript>
      </div>
    </div>
  );
}

function Dashboardb3({
  searchRange,
  setSearchRange,
  propertyTypes,
  setPropertyTypes,
  mlsStatuses,
  setMlsStatuses,
  locationFilters,
  propertyTypesOptions,
  filtersPart1,
  minMaxInputs,
  searchRangeOptions,
  mlsStatusesOptions,
  selectedAddress,
  setSelectedAddress,
}) {
  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    // Assuming 'address' contains the address string
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        // You might need to lift this state up to the parent component
        // or use a different state management solution
        // setCenter(results[0].geometry.location);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen p-6">
      {/* ... (rest of the Dashboardb3 component code) */}
    </div>
  );
}

export default MainComponent;
