import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationPickerProps {
  pickupLocation: Location;
  dropoffLocation: Location;
  onPickupChange: (location: Location) => void;
  onDropoffChange: (location: Location) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  pickupLocation,
  dropoffLocation,
  onPickupChange,
  onDropoffChange
}) => {
  const [customPickup, setCustomPickup] = useState('');
  const [customDropoff, setCustomDropoff] = useState('');

  const predefinedLocations = [
    { lat: 28.6139, lng: 77.2090, address: 'New Delhi, India' },
    { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' },
    { lat: 12.9716, lng: 77.5946, address: 'Bangalore, Karnataka' },
    { lat: 22.5726, lng: 88.3639, address: 'Kolkata, West Bengal' },
    { lat: 13.0827, lng: 80.2707, address: 'Chennai, Tamil Nadu' },
    { lat: 18.5204, lng: 73.8567, address: 'Pune, Maharashtra' },
    { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat' },
    { lat: 26.9124, lng: 75.7873, address: 'Jaipur, Rajasthan' }
  ];

  const handleLocationSelect = (location: Location, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') {
      onPickupChange(location);
    } else {
      onDropoffChange(location);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location'
          };
          onPickupChange(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-900">Select Pickup & Dropoff Locations</h3>
        <p className="text-gray-600 text-sm">Choose convenient locations for your rental</p>
      </div>

      {/* Pickup Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Pickup Location
        </label>
        
        <div className="space-y-3">
          <button
            onClick={getCurrentLocation}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Navigation className="w-4 h-4 text-blue-600" />
            <span>Use Current Location</span>
          </button>

          <div className="grid grid-cols-1 gap-2">
            {predefinedLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location, 'pickup')}
                className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
                  pickupLocation.address === location.address
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{location.address}</span>
                </div>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={customPickup}
            onChange={(e) => setCustomPickup(e.target.value)}
            placeholder="Or enter custom address..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Dropoff Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Dropoff Location
        </label>
        
        <div className="space-y-3">
          <button
            onClick={() => onDropoffChange(pickupLocation)}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
              dropoffLocation.address === pickupLocation.address
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>Same as Pickup Location</span>
          </button>

          <div className="grid grid-cols-1 gap-2">
            {predefinedLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location, 'dropoff')}
                className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
                  dropoffLocation.address === location.address
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{location.address}</span>
                </div>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={customDropoff}
            onChange={(e) => setCustomDropoff(e.target.value)}
            placeholder="Or enter custom address..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Interactive map would be displayed here</p>
        <p className="text-gray-500 text-sm mt-1">Google Maps integration available in production</p>
      </div>
    </div>
  );
};

export default LocationPicker;