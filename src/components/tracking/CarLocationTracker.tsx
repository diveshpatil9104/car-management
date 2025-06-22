import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Gauge, Compass, RefreshCw } from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { Car } from '../../types';

interface CarLocationTrackerProps {
  car: Car;
  onClose: () => void;
}

const CarLocationTracker: React.FC<CarLocationTrackerProps> = ({ car, onClose }) => {
  const { updateCar } = useCars();
  const [isTracking, setIsTracking] = useState(car.isTracking || false);
  const [locationHistory, setLocationHistory] = useState<Array<{
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  }>>([]);

  // Simulate real-time location updates
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      // Simulate GPS movement (in real app, this would come from GPS device in car)
      const baseLocation = car.currentLocation || car.location;
      const randomOffset = () => (Math.random() - 0.5) * 0.01; // Small random movement
      
      const newLocation = {
        lat: baseLocation.lat + randomOffset(),
        lng: baseLocation.lng + randomOffset(),
        address: `Moving near ${baseLocation.address}`,
        lastUpdated: new Date().toISOString(),
        speed: Math.floor(Math.random() * 60) + 20, // Random speed 20-80 mph
        heading: Math.floor(Math.random() * 360), // Random direction
      };

      // Update car location
      updateCar(car.id, {
        currentLocation: newLocation,
        isTracking: true
      });

      // Add to history
      setLocationHistory(prev => [
        {
          lat: newLocation.lat,
          lng: newLocation.lng,
          address: newLocation.address,
          timestamp: newLocation.lastUpdated
        },
        ...prev.slice(0, 9) // Keep last 10 locations
      ]);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isTracking, car.id, updateCar]);

  const toggleTracking = () => {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);
    
    if (newTrackingState) {
      // Start tracking - initialize current location
      updateCar(car.id, {
        currentLocation: {
          ...car.location,
          lastUpdated: new Date().toISOString(),
          speed: 0,
          heading: 0
        },
        isTracking: true
      });
    } else {
      // Stop tracking
      updateCar(car.id, {
        isTracking: false
      });
    }
  };

  const currentLoc = car.currentLocation || car.location;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Track {car.make} {car.model}
            </h2>
            <p className="text-gray-600">Real-time location tracking</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Tracking Controls */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="font-medium">
                  {isTracking ? 'Live Tracking Active' : 'Tracking Disabled'}
                </span>
              </div>
              <button
                onClick={toggleTracking}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isTracking 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isTracking ? <RefreshCw className="w-4 h-4" /> : <Navigation className="w-4 h-4" />}
                <span>{isTracking ? 'Stop Tracking' : 'Start Tracking'}</span>
              </button>
            </div>
          </div>

          {/* Current Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Current Location</span>
              </div>
              <p className="text-sm text-blue-800">{currentLoc.address}</p>
              <p className="text-xs text-blue-600 mt-1">
                {currentLoc.lat.toFixed(6)}, {currentLoc.lng.toFixed(6)}
              </p>
            </div>

            {car.currentLocation && (
              <>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gauge className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Speed</span>
                  </div>
                  <p className="text-lg font-bold text-green-800">
                    {car.currentLocation.speed || 0} mph
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Compass className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Heading</span>
                  </div>
                  <p className="text-lg font-bold text-purple-800">
                    {car.currentLocation.heading || 0}°
                  </p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-900">Last Update</span>
                  </div>
                  <p className="text-sm text-orange-800">
                    {new Date(car.currentLocation.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Live Map View</h3>
            <p className="text-gray-600 mb-4">
              Interactive map showing real-time car location would be displayed here
            </p>
            <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Car Location: {currentLoc.address}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Coordinates: {currentLoc.lat.toFixed(6)}, {currentLoc.lng.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Location History */}
          {locationHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location History</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {locationHistory.map((location, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{location.address}</p>
                      <p className="text-xs text-gray-500">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(location.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isTracking && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Start tracking to see real-time location updates. 
                In a production environment, this would connect to GPS devices installed in the vehicles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarLocationTracker;