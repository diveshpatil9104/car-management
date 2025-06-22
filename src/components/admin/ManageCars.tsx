import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useCars } from '../../context/CarContext';
import CarCard from '../cars/CarCard';
import CarForm from './CarForm';
import { Car } from '../../types';

const ManageCars: React.FC = () => {
  const { cars, deleteCar } = useCars();
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleDelete = (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      deleteCar(carId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCar(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Cars</h1>
          <p className="text-gray-600">Add, edit, and manage your car inventory</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Car</span>
        </button>
      </div>

      {/* Car Grid */}
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <CarCard
              key={car.id}
              car={car}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cars added yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first car to the inventory</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all"
          >
            Add Your First Car
          </button>
        </div>
      )}

      {/* Car Form Modal */}
      {showForm && (
        <CarForm
          car={editingCar}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default ManageCars;