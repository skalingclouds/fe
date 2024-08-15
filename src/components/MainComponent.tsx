import React from "react";
import dynamic from 'next/dynamic';
import { LineChart, AreaChart, BarChart, XAxis, YAxis, CartesianGrid, Line, Area, Bar } from "recharts";
import { APIProvider, Map } from "@react-google-maps/api";
import { Select, Checkbox, Label, Input } from "@/components/ui";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const GOOGLE_MAPS_API_KEY = publicRuntimeConfig.GOOGLE_MAPS_API_KEY;

const DynamicMap = dynamic(() => import('@react-google-maps/api').then((mod) => mod.Map), {
  ssr: false
});

function MainComponent() {
  // ... (rest of the component code)
}

function Dashboardb3({
  // ... (Dashboardb3 props)
}) {
  // ... (Dashboardb3 component code)
}

export default MainComponent;
