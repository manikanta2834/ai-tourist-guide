import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function Hero3DMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    'esri-satellite': {
                        type: 'raster',
                        tiles: [
                            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        ],
                        tileSize: 256,
                        attribution: '&copy; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    }
                },
                layers: [
                    {
                        id: 'satellite',
                        type: 'raster',
                        source: 'esri-satellite'
                    }
                ]
            },
            center: [79.9351, 12.8808], // Vallakottai Murugan Temple
            zoom: 16.5,
            pitch: 65,
            bearing: -20,
            antialias: true,
            interactive: false, // Disable interaction for hero background
            attributionControl: false // Minimal UI
        });

        const currMap = map.current;

        currMap.on('load', () => {
            // Auto-rotation
            function rotateCamera(timestamp: number) {
                // Clamp the rotation between 0 -360 degrees
                // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
                currMap.rotateTo((timestamp / 100) % 360, { duration: 0 });
                // Request the next frame of the animation.
                requestAnimationFrame(rotateCamera);
            }

            requestAnimationFrame(rotateCamera);
        });

        return () => {
            currMap.remove();
        };
    }, []);

    return (
        <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div ref={mapContainer} className="w-full h-full" />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent pointer-events-none" />

            {/* Floating Badge */}
            <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                <div className="inline-block bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                    <h3 className="text-white font-bold text-lg">Vallakottai Murugan Temple</h3>
                    <p className="text-gray-300 text-sm">Live 3D View (Satellite)</p>
                </div>
            </div>
        </div>
    );
}
