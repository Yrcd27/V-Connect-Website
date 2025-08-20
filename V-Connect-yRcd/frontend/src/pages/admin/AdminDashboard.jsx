import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminStats from './AdminStats';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalOrganizations: 0,
    totalEvents: 0,
    pendingVolunteers: 0,
    pendingOrganizations: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    
    if (!token || userType !== 'admin') {
      navigate('/login');
      return;
    }
    
    // Fetch dashboard stats
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all users to calculate stats
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users = await response.json();
      
      // Calculate stats
      const volunteers = users.filter(user => user.user_type === 'volunteer');
      const organizations = users.filter(user => user.user_type === 'organization');
      
      const pendingVolunteers = volunteers.filter(vol => !vol.is_active).length;
      const pendingOrganizations = organizations.filter(org => !org.is_active).length;
      
      setStats({
        totalVolunteers: volunteers.length,
        totalOrganizations: organizations.length,
        totalEvents: 0, // Will need a separate API call to count events
        pendingVolunteers,
        pendingOrganizations
      });
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminSidebar>
      <div className='p-5'>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Admin Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AdminStats stats={stats} />
      )}
      </div>
    </AdminSidebar>
  );
};

export default AdminDashboard;
