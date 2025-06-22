import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle, Car, Navigation, Phone, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { useCars } from '../../context/CarContext';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const { getBookingsByUser, updateBooking } = useBookings();
  const { getCar } = useCars();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed' | 'cancelled'>('all');
  
  const bookings = user ? getBookingsByUser(user.id) : [];

  const getBookingStatus = (booking: any) => {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    if (booking.status === 'cancelled' || booking.status === 'rejected') {
      return 'cancelled';
    }
    if (booking.status === 'completed') {
      return 'completed';
    }
    if (isAfter(now, endDate)) {
      return 'completed';
    }
    if (isAfter(now, startDate) && isBefore(now, endDate)) {
      return 'active';
    }
    if (isBefore(now, startDate)) {
      return 'upcoming';
    }
    return 'upcoming';
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return getBookingStatus(booking) === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateBooking(bookingId, { status: 'cancelled' });
    }
  };

  const canCancelBooking = (booking: any) => {
    const startDate = new Date(booking.startDate);
    const now = new Date();
    const hoursUntilStart = differenceInDays(startDate, now) * 24;
    
    return booking.status === 'pending' || booking.status === 'approved' && hoursUntilStart > 24;
  };

  const statusCounts = {
    all: bookings.length,
    upcoming: bookings.filter(b => getBookingStatus(b) === 'upcoming').length,
    active: bookings.filter(b => getBookingStatus(b) === 'active').length,
    completed: bookings.filter(b => getBookingStatus(b) === 'completed').length,
    cancelled: bookings.filter(b => getBookingStatus(b) === 'cancelled').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600 text-lg">Track your car rental history and manage current bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Bookings', count: statusCounts.all },
            { key: 'upcoming', label: 'Upcoming', count: statusCounts.upcoming },
            { key: 'active', label: 'Active', count: statusCounts.active },
            { key: 'completed', label: 'Completed', count: statusCounts.completed },
            { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const car = getCar(booking.carId);
            const bookingStatus = getBookingStatus(booking);
            
            if (!car) return null;

            return (
              <div key={booking.id} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <img 
                          src={car.image} 
                          alt={`${car.make} ${car.model}`}
                          className="w-24 h-20 object-cover rounded-xl shadow-md"
                        />
                        {bookingStatus === 'active' && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-gray-600 mb-2">{car.year} • {car.category}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Booking ID: {booking.id}</span>
                          <span>•</span>
                          <span>Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(booking.status)} mb-3`}>
                        {getStatusIcon(booking.status)}
                        <span className="text-sm font-medium capitalize">{booking.status}</span>
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        Payment: {booking.paymentStatus}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Rental Period</p>
                          <p className="text-sm text-blue-700">
                            {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {differenceInDays(new Date(booking.endDate), new Date(booking.startDate))} days
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Pickup Location</p>
                          <p className="text-sm text-green-700">{booking.pickupLocation.address}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-purple-900">Total Amount</p>
                          <p className="text-lg font-bold text-purple-700">₹{booking.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <Car className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-orange-900">Status</p>
                          <p className="text-sm font-semibold text-orange-700 capitalize">{bookingStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.dropoffLocation.address !== booking.pickupLocation.address && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Dropoff Location</p>
                          <p className="text-sm text-gray-700">{booking.dropoffLocation.address}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <p className="text-sm font-medium text-gray-900 mb-2">Special Notes</p>
                      <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                  )}

                  {/* Status Messages */}
                  {booking.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <p className="text-sm text-yellow-800 font-medium">
                          Your booking is pending approval. You will be notified once it's reviewed.
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.status === 'approved' && bookingStatus === 'upcoming' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-800 font-medium">
                          Your booking has been approved! Please arrive at the pickup location on time.
                        </p>
                      </div>
                    </div>
                  )}

                  {bookingStatus === 'active' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-blue-800 font-medium">
                          Your rental is currently active. Enjoy your trip!
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-800 font-medium">
                          Your booking was rejected. Please contact support for more information.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                    {canCancelBooking(booking) && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel Booking</span>
                      </button>
                    )}

                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>Contact Support</span>
                    </button>

                    <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Live Chat</span>
                    </button>

                    {bookingStatus === 'completed' && (
                      <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        <span>⭐</span>
                        <span>Rate Experience</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No bookings found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' ? 'You haven\'t made any bookings yet' : `No ${filter} bookings found`}
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
            Browse Available Cars
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBookings;