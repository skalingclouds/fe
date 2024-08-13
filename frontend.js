"use client";
import React from "react";
import * as Recharts from "recharts";
import * as ReactGoogleMaps from "@/libraries/react-google-maps";
import * as ShadcnUI from "@/design-libraries/shadcn-ui";

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function MainComponent() {
  const [searchRange, setSearchRange] = React.useState("");
  const [propertyTypes, setPropertyTypes] = React.useState([]);
  const [mlsStatuses, setMlsStatuses] = React.useState([]);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
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
  const [center, setCenter] = React.useState({ lat: 37.7749, lng: -122.4194 });

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    // Assuming 'address' contains the address string
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        setCenter(results[0].geometry.location);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };

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
          <Recharts.LineChart width={300} height={200} data={chartData}>
            <Recharts.XAxis dataKey="name" />
            <Recharts.YAxis />
            <Recharts.CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Recharts.Line type="monotone" dataKey="value" stroke="#dbd8e3" />
          </Recharts.LineChart>
        </div>
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-white">
          <Recharts.AreaChart width={300} height={200} data={chartData}>
            <Recharts.XAxis dataKey="name" />
            <Recharts.YAxis />
            <Recharts.CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Recharts.Area
              type="monotone"
              dataKey="value"
              stroke="#5c5470"
              fill="#352f44"
            />
          </Recharts.AreaChart>
        </div>
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-white">
          <Recharts.BarChart width={300} height={200} data={chartData}>
            <Recharts.XAxis dataKey="name" />
            <Recharts.YAxis />
            <Recharts.CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Recharts.Bar dataKey="value" fill="#dbd8e3" />
          </Recharts.BarChart>
        </div>
      </div>
      <div className="mt-8 h-[400px]">
        <ReactGoogleMaps.APIProvider apiKey={NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <ReactGoogleMaps.Map
            id="example-map"
            mapId="example-map"
            center={center}
            onCenterChanged={(e) => setCenter(e.detail.center)}
            zoom={12}
            mapTypeId="satellite"
          ></ReactGoogleMaps.Map>
        </ReactGoogleMaps.APIProvider>
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
  return (
    <div className="bg-[#121212] text-white min-h-screen p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Query Builder</h1>
        <ShadcnUI.CustomSelect
          placeholder="Select date range"
          value={searchRange}
          onValueChange={setSearchRange}
          groups={[
            {
              items: searchRangeOptions.map((option) => ({
                value: option,
                label: option.replace("_", " ").toLowerCase(),
              })),
            },
          ]}
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-white">
          <h2 className="text-xl font-semibold mb-4">Location Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locationFilters.map((filter) => (
              <div key={filter.field}>
                <ShadcnUI.Label htmlFor={filter.field}>
                  {filter.name}
                </ShadcnUI.Label>
                <ShadcnUI.Input
                  id={filter.field}
                  placeholder={filter.hint}
                  className="bg-[#1E1E1E] border-white"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E1E1E] p-6 rounded-lg border border-white">
          <h2 className="text-xl font-semibold mb-4">Property Parameters</h2>
          <div className="mb-4">
            <ShadcnUI.Label>Property Types</ShadcnUI.Label>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypesOptions.map((type) => (
                <div key={type} className="flex items-center">
                  <ShadcnUI.Checkbox
                    id={type}
                    className="border border-white"
                  />
                  <ShadcnUI.Label htmlFor={type} className="ml-2">
                    {type}
                  </ShadcnUI.Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {minMaxInputs.map((input) => (
              <div key={input} className="flex flex-col">
                <ShadcnUI.Label>{input.replace(/_/g, " ")}</ShadcnUI.Label>
                <div className="flex gap-2">
                  <ShadcnUI.Input
                    placeholder="Min"
                    className="bg-[#1E1E1E] border-white"
                  />
                  <ShadcnUI.Input
                    placeholder="Max"
                    className="bg-[#1E1E1E] border-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1E] p-6 rounded-lg mb-8 border border-white">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtersPart1.map((filter) => (
            <div key={filter} className="flex items-center space-x-2">
              <ShadcnUI.Checkbox id={filter} className="border border-white" />
              <ShadcnUI.Label htmlFor={filter}>
                {filter.replace(/_/g, " ")}
              </ShadcnUI.Label>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold mt-6 mb-2">Modifers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <ShadcnUI.Checkbox id="OR" className="border border-white" />
            <ShadcnUI.Label htmlFor="OR">OR</ShadcnUI.Label>
          </div>
          <div className="flex items-center space-x-2">
            <ShadcnUI.Checkbox id="EXCLUDE" className="border border-white" />
            <ShadcnUI.Label htmlFor="EXCLUDE">EXCLUDE</ShadcnUI.Label>
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1E] p-6 rounded-lg border border-white">
        <h2 className="text-xl font-semibold mb-4">MLS Status</h2>
        <ShadcnUI.CustomSelect
          placeholder="Select MLS statuses"
          value={mlsStatuses}
          onValueChange={setMlsStatuses}
          groups={[
            {
              items: mlsStatusesOptions.map((status) => ({
                value: status,
                label: status.replace("ml_", "").replace("mls_", ""),
              })),
            },
          ]}
        />
      </div>
      <div className="bg-[#1E1E1E] p-6 rounded-lg border border-white mt-8">
        <h2 className="text-xl font-semibold mb-4">Location Results</h2>
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {locationFilters.map((filter) => (
                <th
                  key={filter.field}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {filter.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {locationFilters.map((filter, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-800" : ""}
                onClick={() => handleAddressClick(filter.hint)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {filter.hint}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* Add other location data here */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* Add other location data here */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* Add other location data here */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* Add other location data here */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* Add other location data here */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* Add other location data here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MainComponent;