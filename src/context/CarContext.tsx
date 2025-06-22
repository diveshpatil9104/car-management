import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Car } from '../types';

interface CarContextType {
  cars: Car[];
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  getCar: (id: string) => Car | undefined;
  filteredCars: Car[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const CarContext = createContext<CarContextType | null>(null);

export const useCars = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};

const initialCars: Car[] = [
  {
    id: '1',
    make: 'Tata',
    model: 'Nexon EV',
    year: 2023,
    price: 2500,
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Premium electric SUV with advanced features and spacious interior.',
    features: ['Electric', 'Premium Sound', 'Fast Charging', 'Sunroof'],
    available: true,
    category: 'suv',
    transmission: 'automatic',
    fuelType: 'electric',
    seats: 5,
    mileage: 312,
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'New Delhi, India'
    },
    isTracking: false
  },
  {
    id: '2',
    make: 'Mahindra',
    model: 'XUV700',
    year: 2023,
    price: 3200,
    image: 'https://images.pexels.com/photos/3752806/pexels-photo-3752806.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Premium SUV with advanced safety features and luxurious interior.',
    features: ['All-Wheel Drive', 'Premium Interior', 'Advanced Safety', 'Large Boot'],
    available: true,
    category: 'suv',
    transmission: 'automatic',
    fuelType: 'diesel',
    seats: 7,
    mileage: 16,
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Mumbai, Maharashtra'
    },
    isTracking: false
  },
  {
    id: '3',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2023,
    price: 1800,
    image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Reliable and fuel-efficient hatchback perfect for city driving.',
    features: ['Fuel Efficient', 'Reliable', 'Comfortable', 'Easy Parking'],
    available: true,
    category: 'compact',
    transmission: 'manual',
    fuelType: 'gasoline',
    seats: 5,
    mileage: 23,
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Bangalore, Karnataka'
    },
    isTracking: false
  },
  {
    id: '4',
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    price: 5500,
    image: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Luxury sedan with premium features and exceptional performance.',
    features: ['Luxury Interior', 'Sport Mode', 'Premium Audio', 'Leather Seats'],
    available: false,
    category: 'luxury',
    transmission: 'automatic',
    fuelType: 'gasoline',
    seats: 5,
    mileage: 15,
    location: {
      lat: 22.5726,
      lng: 88.3639,
      address: 'Kolkata, West Bengal'
    },
    currentLocation: {
      lat: 22.5726,
      lng: 88.3639,
      address: 'Moving near Kolkata, West Bengal',
      lastUpdated: new Date().toISOString(),
      speed: 45,
      heading: 90
    },
    isTracking: true
  },
  {
    id: '5',
    make: 'Hyundai',
    model: 'Creta',
    year: 2023,
    price: 2800,
    image: 'https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Popular compact SUV with modern features and comfortable ride.',
    features: ['Touchscreen', 'Reverse Camera', 'Cruise Control', 'Wireless Charging'],
    available: true,
    category: 'suv',
    transmission: 'automatic',
    fuelType: 'gasoline',
    seats: 5,
    mileage: 17,
    location: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Chennai, Tamil Nadu'
    },
    isTracking: false
  },
  {
    id: '6',
    make: 'Honda',
    model: 'City',
    year: 2023,
    price: 2200,
    image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Premium sedan with excellent fuel efficiency and comfort.',
    features: ['Spacious', 'Fuel Efficient', 'Premium Interior', 'Safety Features'],
    available: true,
    category: 'economy',
    transmission: 'automatic',
    fuelType: 'gasoline',
    seats: 5,
    mileage: 18,
    location: {
      lat: 18.5204,
      lng: 73.8567,
      address: 'Pune, Maharashtra'
    },
    isTracking: false
  }
];

interface CarProviderProps {
  children: ReactNode;
}

export const CarProvider: React.FC<CarProviderProps> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    const storedCars = localStorage.getItem('cars');
    if (storedCars) {
      setCars(JSON.parse(storedCars));
    } else {
      setCars(initialCars);
      localStorage.setItem('cars', JSON.stringify(initialCars));
    }
  }, []);

  const addCar = (carData: Omit<Car, 'id'>) => {
    const newCar: Car = {
      ...carData,
      id: Date.now().toString(),
      isTracking: false
    };
    const updatedCars = [...cars, newCar];
    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));
  };

  const updateCar = (id: string, carData: Partial<Car>) => {
    const updatedCars = cars.map(car => 
      car.id === id ? { ...car, ...carData } : car
    );
    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));
  };

  const deleteCar = (id: string) => {
    const updatedCars = cars.filter(car => car.id !== id);
    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));
  };

  const getCar = (id: string) => {
    return cars.find(car => car.id === id);
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || car.category === categoryFilter;
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice && car.available;
  });

  return (
    <CarContext.Provider value={{
      cars,
      addCar,
      updateCar,
      deleteCar,
      getCar,
      filteredCars,
      searchQuery,
      setSearchQuery,
      categoryFilter,
      setCategoryFilter,
      priceRange,
      setPriceRange
    }}>
      {children}
    </CarContext.Provider>
  );
};