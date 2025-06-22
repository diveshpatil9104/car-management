import React, { useState } from 'react';
import { X, Calendar, TrendingUp, DollarSign, Car, Users, BarChart3, PieChart, Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { useCars } from '../../context/CarContext';
import { useBookings } from '../../context/BookingContext';
import { format, subDays, subMonths, subYears, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

interface ReportsModalProps {
  onClose: () => void;
}

const ReportsModal: React.FC<ReportsModalProps> = ({ onClose }) => {
  const { cars } = useCars();
  const { getAllBookings } = useBookings();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'revenue' | 'bookings' | 'cars'>('overview');
  
  const bookings = getAllBookings();

  // Filter data based on selected period
  const getFilteredData = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (selectedPeriod) {
      case 'daily':
        startDate = subDays(now, 30); // Last 30 days
        break;
      case 'monthly':
        startDate = subMonths(now, 12); // Last 12 months
        break;
      case 'yearly':
        startDate = subYears(now, 5); // Last 5 years
        break;
      default:
        startDate = subMonths(now, 12);
    }

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= startDate && bookingDate <= endDate;
    });
  };

  const filteredBookings = getFilteredData();

  // Generate chart data based on period
  const generateChartData = () => {
    const data = [];
    const now = new Date();
    
    if (selectedPeriod === 'daily') {
      for (let i = 29; i >= 0; i--) {
        const date = subDays(now, i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        
        const dayBookings = filteredBookings.filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= dayStart && bookingDate <= dayEnd;
        });

        data.push({
          period: format(date, 'MMM dd'),
          bookings: dayBookings.length,
          revenue: dayBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0),
          approved: dayBookings.filter(b => b.status === 'approved').length,
          rejected: dayBookings.filter(b => b.status === 'rejected').length,
          completed: dayBookings.filter(b => b.status === 'completed').length,
        });
      }
    } else if (selectedPeriod === 'monthly') {
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(now, i);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        
        const monthBookings = filteredBookings.filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        });

        data.push({
          period: format(date, 'MMM yyyy'),
          bookings: monthBookings.length,
          revenue: monthBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0),
          approved: monthBookings.filter(b => b.status === 'approved').length,
          rejected: monthBookings.filter(b => b.status === 'rejected').length,
          completed: monthBookings.filter(b => b.status === 'completed').length,
        });
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const date = subYears(now, i);
        const yearStart = startOfYear(date);
        const yearEnd = endOfYear(date);
        
        const yearBookings = filteredBookings.filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= yearStart && bookingDate <= yearEnd;
        });

        data.push({
          period: format(date, 'yyyy'),
          bookings: yearBookings.length,
          revenue: yearBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0),
          approved: yearBookings.filter(b => b.status === 'approved').length,
          rejected: yearBookings.filter(b => b.status === 'rejected').length,
          completed: yearBookings.filter(b => b.status === 'completed').length,
        });
      }
    }

    return data;
  };

  const chartData = generateChartData();

  // Status distribution data
  const statusData = [
    { name: 'Approved', value: filteredBookings.filter(b => b.status === 'approved').length, color: '#10B981' },
    { name: 'Pending', value: filteredBookings.filter(b => b.status === 'pending').length, color: '#F59E0B' },
    { name: 'Rejected', value: filteredBookings.filter(b => b.status === 'rejected').length, color: '#EF4444' },
    { name: 'Completed', value: filteredBookings.filter(b => b.status === 'completed').length, color: '#3B82F6' },
  ];

  // Car category data
  const categoryData = cars.reduce((acc, car) => {
    const existing = acc.find(item => item.name === car.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: car.category, value: 1, color: getRandomColor() });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  function getRandomColor() {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Summary statistics
  const totalRevenue = filteredBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);
  const totalBookings = filteredBookings.length;
  const approvedBookings = filteredBookings.filter(b => b.status === 'approved').length;
  const completionRate = totalBookings > 0 ? Math.round((filteredBookings.filter(b => b.status === 'completed').length / totalBookings) * 100) : 0;

  const exportData = () => {
    const csvContent = [
      ['Period', 'Bookings', 'Revenue', 'Approved', 'Rejected', 'Completed'],
      ...chartData.map(row => [row.period, row.bookings, row.revenue, row.approved, row.rejected, row.completed])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rental-report-${selectedPeriod}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Analytics & Reports
            </h2>
            <p className="text-gray-600 mt-1">Comprehensive business insights and performance metrics</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Period:</span>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['daily', 'monthly', 'yearly'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'overview', label: 'Overview', icon: BarChart3 },
                  { key: 'revenue', label: 'Revenue', icon: DollarSign },
                  { key: 'bookings', label: 'Bookings', icon: Calendar },
                  { key: 'cars', label: 'Fleet', icon: Car }
                ].map((report) => {
                  const IconComponent = report.icon;
                  return (
                    <button
                      key={report.key}
                      onClick={() => setSelectedReport(report.key as any)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedReport === report.key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{report.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={exportData}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-900">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-green-900">{totalBookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Approved</p>
                  <p className="text-2xl font-bold text-purple-900">{approvedBookings}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Completion Rate</p>
                  <p className="text-2xl font-bold text-orange-900">{completionRate}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedReport === 'revenue' ? 'Revenue Trends' : 
                 selectedReport === 'bookings' ? 'Booking Trends' : 
                 selectedReport === 'cars' ? 'Fleet Utilization' : 'Performance Overview'}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedReport === 'revenue' ? (
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  ) : selectedReport === 'bookings' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="completed" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#3B82F6" />
                      <Bar dataKey="revenue" fill="#10B981" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Charts */}
            <div className="space-y-6">
              {/* Booking Status Distribution */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Car Categories */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name} (${value})`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chartData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.period}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.bookings}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{row.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{row.approved}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{row.rejected}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{row.completed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;