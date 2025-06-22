import React from 'react';
import { Car as CarType } from '../../types';
import { 
  MapPin, 
  Users, 
  Fuel, 
  Gauge, 
  Calendar,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

interface CarCardProps {
  car: CarType;
  onRent?: (car: CarType) => void;
  onEdit?: (car: CarType) => void;
  onDelete?: (carId: string) => void;
  isAdmin?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ 
  car, 
  onRent, 
  onEdit, 
  onDelete, 
  isAdmin = false 
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      economy: 'bg-green-100 text-green-800',
      compact: 'bg-blue-100 text-blue-800',
      luxury: 'bg-purple-100 text-purple-800',
      suv: 'bg-orange-100 text-orange-800',
      sports: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="relative">
        <img 
          src={car.image} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(car.category)}`}>
            {car.category.charAt(0).toUpperCase() + car.category.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          {car.available ? (
            <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              <CheckCircle className="w-3 h-3" />
              <span>Available</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
              <Clock className="w-3 h-3" />
              <span>Rented</span>
            </div>
          )}
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
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ₹{car.price}
            </p>
            <p className="text-gray-500 text-sm">per day</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {car.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Users className="w-4 h-4" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Fuel className="w-4 h-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Gauge className="w-4 h-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{car.mileage} {car.fuelType === 'electric' ? 'km' : 'kmpl'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {car.features.slice(0, 3).map((feature, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
          {car.features.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{car.features.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{car.location.address}</span>
        </div>

        {isAdmin ? (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(car)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(car.id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={() => onRent?.(car)}
            disabled={!car.available}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{car.available ? 'Rent Now' : 'Not Available'}</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default CarCard;