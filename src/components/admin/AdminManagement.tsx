import React, { useState } from 'react';
import { X, UserPlus, Shield, ShieldCheck, Mail, Calendar, Search, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminManagementProps {
  onClose: () => void;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: string;
  permissions: string[];
  status: 'active' | 'inactive';
}

const AdminManagement: React.FC<AdminManagementProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    permissions: [] as string[]
  });

  // Get admin users from localStorage
  const getAdminUsers = (): AdminUser[] => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter((u: any) => u.role === 'admin').map((u: any) => ({
      ...u,
      permissions: u.permissions || ['manage_cars', 'manage_bookings', 'view_reports'],
      status: u.status || 'active'
    }));
  };

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(getAdminUsers());

  const availablePermissions = [
    { key: 'manage_cars', label: 'Manage Cars', description: 'Add, edit, and delete vehicles' },
    { key: 'manage_bookings', label: 'Manage Bookings', description: 'Approve, reject, and manage reservations' },
    { key: 'manage_users', label: 'Manage Users', description: 'View and manage customer accounts' },
    { key: 'view_reports', label: 'View Reports', description: 'Access analytics and reports' },
    { key: 'manage_admins', label: 'Manage Admins', description: 'Add and remove admin users' },
    { key: 'system_settings', label: 'System Settings', description: 'Configure system-wide settings' }
  ];

  const filteredAdmins = adminUsers.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAdmin = () => {
    if (!formData.name || !formData.email) return;

    const newAdmin: AdminUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: 'admin',
      createdAt: new Date().toISOString(),
      permissions: formData.permissions,
      status: 'active'
    };

    // Update localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    allUsers.push(newAdmin);
    localStorage.setItem('users', JSON.stringify(allUsers));

    setAdminUsers([...adminUsers, newAdmin]);
    setFormData({ name: '', email: '', permissions: [] });
    setShowAddForm(false);
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      permissions: admin.permissions
    });
    setShowAddForm(true);
  };

  const handleUpdateAdmin = () => {
    if (!editingAdmin || !formData.name || !formData.email) return;

    const updatedAdmin = {
      ...editingAdmin,
      name: formData.name,
      email: formData.email,
      permissions: formData.permissions
    };

    // Update localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map((u: any) => 
      u.id === editingAdmin.id ? updatedAdmin : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setAdminUsers(adminUsers.map(admin => 
      admin.id === editingAdmin.id ? updatedAdmin : admin
    ));
    
    setFormData({ name: '', email: '', permissions: [] });
    setShowAddForm(false);
    setEditingAdmin(null);
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (adminId === user?.id) {
      alert("You cannot delete your own admin account");
      return;
    }

    if (window.confirm('Are you sure you want to remove this admin?')) {
      // Update localStorage
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = allUsers.filter((u: any) => u.id !== adminId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      setAdminUsers(adminUsers.filter(admin => admin.id !== adminId));
    }
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Admin Management
            </h2>
            <p className="text-gray-600 mt-1">Manage administrator accounts and permissions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search admins..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Admin</span>
            </button>
          </div>

          {/* Admin List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditAdmin(admin)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {admin.id !== user?.id && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Added {new Date(admin.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    admin.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      admin.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                    {admin.status}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {admin.permissions.slice(0, 3).map((permission) => {
                      const perm = availablePermissions.find(p => p.key === permission);
                      return (
                        <span key={permission} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          {perm?.label || permission}
                        </span>
                      );
                    })}
                    {admin.permissions.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{admin.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Add/Edit Admin Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-60">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Permissions
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availablePermissions.map((permission) => (
                        <div key={permission.key} className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id={permission.key}
                            checked={formData.permissions.includes(permission.key)}
                            onChange={() => togglePermission(permission.key)}
                            className="mt-1 w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                          />
                          <div>
                            <label htmlFor={permission.key} className="text-sm font-medium text-gray-900 cursor-pointer">
                              {permission.label}
                            </label>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingAdmin(null);
                        setFormData({ name: '', email: '', permissions: [] });
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingAdmin ? handleUpdateAdmin : handleAddAdmin}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all"
                    >
                      {editingAdmin ? 'Update Admin' : 'Add Admin'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;