"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { Card } from "@/components/ui/card";

// Coordenadas para Centro de Convenciones de Lima
const center = {
  lat: -12.0464,
  lng: -77.0282,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function EventMap() {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="relative h-96 bg-gray-100">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <div style={containerStyle}>
            <Map
              center={center}
              zoom={15}
              mapId="DEMO_MAP_ID" //remplazarlo por el id de tu mapa de google en producción
              style={{ width: "100%", height: "100%" }}
              gestureHandling="cooperative"
              disableDefaultUI={false}
            >
              <AdvancedMarker
                position={center}
                title="Centro de Convenciones de Lima"
              >
                <Pin
                  background="#EA4335"
                  borderColor="#1e40af"
                  glyphColor="white"
                />
              </AdvancedMarker>
            </Map>
          </div>
        </APIProvider>

        {/* Fallback en caso de error con la API */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300 group-[.api-error]:opacity-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              Centro de Convenciones de Lima
            </p>
            <p className="text-gray-500 text-sm">
              Av. Javier Prado Este 4200, Surco
            </p>
            <p className="text-red-600 text-sm mt-2">
              Error al cargar Google Maps
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
