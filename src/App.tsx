import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CarProvider } from './context/CarContext';
import { BookingProvider } from './context/BookingContext';
import AuthForm from './components/auth/AuthForm';
import Header from './components/layout/Header';
import CarBrowser from './components/cars/CarBrowser';
import MyBookings from './components/user/MyBookings';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageCars from './components/admin/ManageCars';
import ManageBookings from './components/admin/ManageBookings';
import ManageUsers from './components/admin/ManageUsers';
import LiveCarTracking from './components/admin/LiveCarTracking';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState(() => {
    return user?.role === 'admin' ? 'admin-dashboard' : 'browse-cars';
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'browse-cars':
        return <CarBrowser />;
      case 'my-bookings':
        return <MyBookings />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'manage-cars':
        return <ManageCars />;
      case 'live-tracking':
        return <LiveCarTracking />;
      case 'manage-bookings':
        return <ManageBookings />;
      case 'manage-users':
        return <ManageUsers />;
      default:
        return user.role === 'admin' ? <AdminDashboard /> : <CarBrowser />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </CarProvider>
    </AuthProvider>
  );
}

export default App;