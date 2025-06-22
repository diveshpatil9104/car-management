import React, { useState } from 'react';
import { X, Calendar, MapPin, CreditCard, Clock } from 'lucide-react';
import { Car } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import PaymentForm from './PaymentForm';
import LocationPicker from './LocationPicker';

interface BookingModalProps {
  car: Car;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ car, onClose }) => {
  const { user } = useAuth();
  const { addBooking } = useBookings();
  
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: car.location,
    dropoffLocation: car.location,
    notes: ''
  });

  const calculateDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalAmount = calculateDays() * car.price;

  const handleBookingSubmit = () => {
    if (!user) return;

    addBooking({
      userId: user.id,
      carId: car.id,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      notes: bookingData.notes
    });

    onClose();
  };

  const handlePaymentSuccess = (paymentId: string) => {
    if (!user) return;

    addBooking({
      userId: user.id,
      carId: car.id,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      totalAmount,
      status: 'pending',
      paymentStatus: 'paid',
      paymentId,
      notes: bookingData.notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Book {car.make} {car.model}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img src={car.image} alt={`${car.make} ${car.model}`} className="w-20 h-16 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold text-gray-900">{car.make} {car.model}</h3>
                  <p className="text-gray-600">${car.price}/day</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              {bookingData.startDate && bookingData.endDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">
                        {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-800 font-semibold text-lg">
                        Total: ${totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!bookingData.startDate || !bookingData.endDate}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Location
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <LocationPicker
                pickupLocation={bookingData.pickupLocation}
                dropoffLocation={bookingData.dropoffLocation}
                onPickupChange={(location) => setBookingData(prev => ({ ...prev, pickupLocation: location }))}
                onDropoffChange={(location) => setBookingData(prev => ({ ...prev, dropoffLocation: location }))}
              />

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Car:</span>
                    <span>{car.make} {car.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{calculateDays()} day{calculateDays() !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span>${car.price}/day</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              </div>

              <PaymentForm
                amount={totalAmount}
                onSuccess={handlePaymentSuccess}
                onSkip={handleBookingSubmit}
              />

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;