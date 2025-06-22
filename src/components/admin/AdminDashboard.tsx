import React, { useState } from 'react';
import { 
  Car, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  FileText,
  Settings,
  UserPlus,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useBookings } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import CarForm from './CarForm';
import ManageBookings from './ManageBookings';
import ReportsModal from './ReportsModal';
import ManageUsers from './ManageUsers';
import AdminManagement from './AdminManagement';

const AdminDashboard: React.FC = () => {
  const { cars } = useCars();
  const { getAllBookings } = useBookings();
  const { user } = useAuth();
  const [showCarForm, setShowCarForm] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showAdminManagement, setShowAdminManagement] = useState(false);
  
  const bookings = getAllBookings();
  const availableCars = cars.filter(car => car.available).length;
  const totalRevenue = bookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);
  
  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
  const approvedBookings = bookings.filter(booking => booking.status === 'approved').length;
  const rejectedBookings = bookings.filter(booking => booking.status === 'rejected').length;
  const completedBookings = bookings.filter(booking => booking.status === 'completed').length;

  const stats = [
    {
      title: 'Total Cars',
      value: cars.length,
      icon: Car,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: `${availableCars} available`,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: `${pendingBookings} pending`,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Total earned',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Completion Rate',
      value: `${bookings.length > 0 ? Math.round((completedBookings / bookings.length) * 100) : 0}%`,
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      description: `${completedBookings} completed`,
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Car',
      description: 'Add a new vehicle to your fleet',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      action: () => setShowCarForm(true)
    },
    {
      title: 'View All Bookings',
      description: 'Manage customer bookings',
      icon: Eye,
      color: 'from-green-500 to-green-600',
      action: () => setShowBookings(true)
    },
    {
      title: 'Generate Reports',
      description: 'View analytics and insights',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      action: () => setShowReports(true)
    },
    {
      title: 'Manage Users',
      description: 'User accounts and permissions',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      action: () => setShowUsers(true)
    },
    {
      title: 'Admin Management',
      description: 'Manage admin accounts',
      icon: UserPlus,
      color: 'from-red-500 to-red-600',
      action: () => setShowAdminManagement(true)
    }
  ];

  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Welcome back, {user?.name}! Here's your business overview</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Live Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <div key={index} className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
            <button 
              onClick={() => setShowBookings(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => {
                const car = cars.find(c => c.id === booking.carId);
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(booking.status)}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {car ? `${car.make} ${car.model}` : 'Unknown Car'}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <p className="text-gray-900 font-semibold text-sm mt-1">
                        ₹{booking.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No bookings yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
            <button 
              onClick={() => setShowReports(true)}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              View Reports
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50/80 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Approved Bookings</span>
              </div>
              <span className="text-lg font-bold text-green-600">{approvedBookings}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50/80 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Pending Bookings</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">{pendingBookings}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50/80 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Rejected Bookings</span>
              </div>
              <span className="text-lg font-bold text-red-600">{rejectedBookings}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50/80 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Completed Bookings</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{completedBookings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCarForm && (
        <CarForm
          car={null}
          onClose={() => setShowCarForm(false)}
        />
      )}

      {showBookings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-7xl mx-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
                <button
                  onClick={() => setShowBookings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <ManageBookings />
              </div>
            </div>
          </div>
        </div>
      )}

      {showReports && (
        <ReportsModal onClose={() => setShowReports(false)} />
      )}

      {showUsers && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-7xl mx-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
                <button
                  onClick={() => setShowUsers(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <ManageUsers />
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdminManagement && (
        <AdminManagement onClose={() => setShowAdminManagement(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;