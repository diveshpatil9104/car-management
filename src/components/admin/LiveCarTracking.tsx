import React, { useState } from 'react';
import { MapPin, Navigation, Car, Clock, Gauge, Search } from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useBookings } from '../../context/BookingContext';
import CarLocationTracker from '../tracking/CarLocationTracker';
import { Car as CarType } from '../../types';

const LiveCarTracking: React.FC = () => {
  const { cars } = useCars();
  const { getAllBookings } = useBookings();
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const bookings = getAllBookings();
  
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'tracking' && car.isTracking) ||
                         (statusFilter === 'available' && car.available) ||
                         (statusFilter === 'rented' && !car.available);
    return matchesSearch && matchesStatus;
  });

  const getCarStatus = (car: CarType) => {
    if (car.isTracking) return 'tracking';
    if (car.available) return 'available';
    return 'rented';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tracking':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'available':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rented':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActiveBooking = (carId: string) => {
    return bookings.find(booking => 
      booking.carId === carId && 
      (booking.status === 'approved' || booking.status === 'pending')
    );
  };

  const trackingCars = cars.filter(car => car.isTracking).length;
  const availableCars = cars.filter(car => car.available).length;
  const rentedCars = cars.filter(car => !car.available).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Car Tracking</h1>
        <p className="text-gray-600">Monitor real-time locations of your fleet</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Cars</p>
              <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
            </div>
            <Car className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Live Tracking</p>
              <p className="text-2xl font-bold text-green-600">{trackingCars}</p>
            </div>
            <Navigation className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Available</p>
              <p className="text-2xl font-bold text-blue-600">{availableCars}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">On Rent</p>
              <p className="text-2xl font-bold text-orange-600">{rentedCars}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by make or model..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Cars</option>
              <option value="tracking">Live Tracking</option>
              <option value="available">Available</option>
              <option value="rented">On Rent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map(car => {
          const status = getCarStatus(car);
          const activeBooking = getActiveBooking(car.id);
          const currentLoc = car.currentLocation || car.location;
          
          return (
            <div key={car.id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="relative">
                <img 
                  src={car.image} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {car.isTracking && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>}
                    {status === 'tracking' ? 'Live Tracking' : 
                     status === 'available' ? 'Available' : 'On Rent'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 text-sm">{car.year}</p>
                  </div>
                </div>

                {/* Location Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{currentLoc.address}</span>
                  </div>
                  
                  {car.currentLocation && (
                    <>
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Gauge className="w-4 h-4" />
                        <span>Speed: {car.currentLocation.speed || 0} mph</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Updated: {new Date(car.currentLocation.lastUpdated).toLocaleTimeString()}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Active Booking Info */}
                {activeBooking && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-orange-800 text-sm font-medium">Currently Rented</p>
                    <p className="text-orange-700 text-xs">
                      Booking ID: {activeBooking.id}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => setSelectedCar(car)}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Navigation className="w-4 h-4" />
                    <span>{car.isTracking ? 'View Tracking' : 'Start Tracking'}</span>
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Car className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Car Location Tracker Modal */}
      {selectedCar && (
        <CarLocationTracker
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
};

export default LiveCarTracking;