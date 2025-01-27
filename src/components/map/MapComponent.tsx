'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cities from '@/data/cities.json';


interface MapComponentProps {
  city: string;
  places?: Array<{
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
  }>;
}

const MapComponent = ({ city, places = [] }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // leaflet css
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);

    // map
    if (!mapRef.current) {
      const cityData = cities.cities.find((c) => c.name === city);
      const defaultCoords: [number, number] = [39.9334, 32.8597];
      const coords: [number, number] = cityData ? [cityData.latitude, cityData.longitude] : defaultCoords;
      
      mapRef.current = L.map('map').setView(coords, 11);
        
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }


    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [city, places]);

  return <div id="map" className="w-full h-full rounded-lg" />;
};

export default MapComponent;